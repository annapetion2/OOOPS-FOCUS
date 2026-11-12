
// ---------- grab the elements ----------
const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const distractionItems = document.querySelectorAll(".distraction-item");
const focusTotalEl = document.querySelector(".total-time");
const distractionAmountEl = document.querySelector(".distraction-amount");
const tipText = document.getElementById("tipText");
const nextTipBtn = document.getElementById("nextTip");
const tipSource = document.getElementById("tipSource");
 
// ---------- settings ----------
const SESSION_SECONDS = 25 * 60;
 
// ---------- state ----------
let timeLeft = SESSION_SECONDS;
let deadline = 0;          // timestamp when the running session ends
let timerInterval = null;
let isRunning = false;
 
// today's flow (saved in the browser so a refresh doesn't wipe it)
const todayKey = "oopsfocus:" + new Date().toDateString();
let today = { focusSeconds: 0, sessions: 0, counts: {} };
 
function loadToday() {
  try {
    const saved = JSON.parse(localStorage.getItem(todayKey));
    if (saved) today = saved;
  } catch (e) { /* storage unavailable, keep going in memory */ }
}
function saveToday() {
  try { localStorage.setItem(todayKey, JSON.stringify(today)); } catch (e) {}
}
 
// ---------- display ----------
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}
 
function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  document.title = isRunning ? `${formatTime(timeLeft)} · OOOPS FOCUS` : "OOOPS FOCUS";
}
 
function updateSummary() {
  focusTotalEl.textContent = `Time spent focusing: ${Math.floor(today.focusSeconds / 60)} min`;
 
  let total = 0;
  distractionItems.forEach(item => {
    const n = today.counts[item.dataset.name] || 0;
    item.querySelector(".count-val").textContent = n;
    total += n;
  });
  distractionAmountEl.textContent = `Distraction(s): ${total}`;
}
 
function setStatus(text) { statusText.textContent = text; }
 
// ---------- timer ----------
function tick() {
  const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  if (remaining < timeLeft) {
    today.focusSeconds += timeLeft - remaining;
    timeLeft = remaining;
    updateDisplay();
    updateSummary();
    saveToday();
  }
  if (timeLeft === 0) finishSession();
}
 
function startTimer() {
  if (isRunning) return;
  if (timeLeft === 0) timeLeft = SESSION_SECONDS; // start a fresh session after finishing
 
  isRunning = true;
  deadline = Date.now() + timeLeft * 1000;
  timerInterval = setInterval(tick, 250);
 
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  setStatus("Focusing. You've got this.");
  updateDisplay();
}
 
function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  isRunning = false;
 
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  startBtn.textContent = "Resume";
  setStatus("Paused");
  updateDisplay();
}
 
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = SESSION_SECONDS;
 
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  startBtn.textContent = "Start";
  setStatus("Ready when you are");
  updateDisplay();
}
 
function finishSession() {
  clearInterval(timerInterval);
  isRunning = false;
  today.sessions++;
  saveToday();
  updateSummary();
 
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  startBtn.textContent = "Start";
  setStatus("Session done. Take a short break.");
  updateDisplay();
}
 
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
 
// ---------- distractions ----------
distractionItems.forEach(item => {
  item.addEventListener("click", () => {
    const name = item.dataset.name;
    today.counts[name] = (today.counts[name] || 0) + 1;
    saveToday();
    updateSummary();
 
    item.classList.remove("bump");
    void item.offsetWidth; // restart the little animation
    item.classList.add("bump");
 
    scheduleTip();
  });
});
 
// ---------- tips (live from Gemini) ----------
const GEMINI_API_KEY = " ";
const GEMINI_MODEL = "gemini-2.5-flash"; 
const PROXY_URL = "";                    
 
// used only if Gemini can't be reached
const fallbackTips = [
  "Put your phone in another room. Out of sight beats willpower.",
  "When a random thought pops up, jot it on paper and go back. Deal with it after the timer.",
  "Eat something small before you start so hunger doesn't cut your session short.",
  "Close every tab you don't need for this session.",
  "Take a real break when the timer ends: stand up, stretch, look out a window."
];
 
let tipRequestId = 0;
let tipDebounce = null;
 
function buildPrompt() {
  const counts = Object.entries(today.counts)
    .filter(([, n]) => n > 0)
    .map(([name, n]) => `${name}: ${n}`)
    .join(", ") || "none yet";
  const state = isRunning ? "in the middle of a focus session"
    : timeLeft === 0 ? "just finished a session"
    : "about to start or paused";
 
  return "You are a friendly focus coach inside a Pomodoro timer app. " +
    `Distractions logged today: ${counts}. ` +
    `Minutes focused today: ${Math.floor(today.focusSeconds / 60)}. ` +
    `The user is ${state}. ` +
    "Give ONE short, practical tip (max 30 words) aimed at their most frequent distraction, " +
    "or a general focus tip if there are none. Plain text only: no emojis, no lists, no preamble. " +
    `Make it different from this one: "${tipText.textContent}"`;
}
 
async function fetchAiTip() {
  const body = JSON.stringify({ contents: [{ parts: [{ text: buildPrompt() }] }] });
  let response;
 
  if (PROXY_URL) {
    response = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });
  } else if (GEMINI_API_KEY) {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
        body
      }
    );
  } else {
    throw new Error("No Gemini key or proxy set");
  }
 
  if (!response.ok) throw new Error("Gemini error " + response.status);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response");
  return text.trim();
}
 
async function loadTip() {
  const myId = ++tipRequestId;
  nextTipBtn.disabled = true;
  tipSource.textContent = "Thinking of a tip for you…";
 
  try {
    const tip = await fetchAiTip();
    if (myId !== tipRequestId) return; // a newer request replaced this one
    tipText.textContent = tip;
    tipSource.textContent = "Live tip from Gemini";
  } catch (err) {
    if (myId !== tipRequestId) return;
    tipText.textContent = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    tipSource.textContent = "Saved tip (Gemini isn't connected)";
  } finally {
    if (myId === tipRequestId) nextTipBtn.disabled = false;
  }
}
 
// after you log a distraction, wait a moment, then ask for a fresh tip about it
function scheduleTip() {
  clearTimeout(tipDebounce);
  tipDebounce = setTimeout(loadTip, 1500);
}
 
nextTipBtn.addEventListener("click", loadTip);
 
// ---------- start up ----------
loadToday();
updateDisplay();
updateSummary();
loadTip();
 
