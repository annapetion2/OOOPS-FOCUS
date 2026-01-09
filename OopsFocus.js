 // grabbing the element 
 const timerDisplay = document.getElementById("timer");
 const startBtn = document.getElementById("startBtn"); // start button 
 const pauseBtn = document.getElementById("pauseBtn"); // pause button 
 const resetBtn = document.getElementById("resetBtn"); // reset button 
 const distractionDisplay = document.querySelector(".distraction-list");
 const distractionItem = document.querySelectorAll(".distraction-item");
 const focusTotal = document.querySelector(".total-time");


 // the time we are starting with - 25 mn 

 let timeLeft = 25 * 60; // mn in sec 
 let timerInterval = 0;
 let isRunning = false;
 let counterItem = 0; 
 let totalFocus =0; // keeping track of the total focus time 



// timer display 
function updateDisplay (){
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent = 
  `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

}

 // function to start the timer 
 startBtn.addEventListener("click", () => {
  // check if timer is already running 
  if (isRunning == true){
    return;
  }
  isRunning = true;

  // goes second by sec 

  timerInterval = setInterval(() => {
    if (timeLeft > 0){
      timeLeft--;
      updateDisplay();
      totalFocus++;

    }else{
      clearInterval(timerInterval);
      isRunning = false;
    }
  }, 1000);

});

// pause function 

pauseBtn.addEventListener("click", ()=> {
  if (isRunning == false){
    return;
  }
  // pause the timer 
  clearInterval(timerInterval);
  isRunning = false;
  totalFocusTime ();
});

// reset button 
resetBtn.addEventListener("click", () =>{
  clearInterval(timerInterval);
  isRunning = false;

  // reset back to 25 mn
  timeLeft = 25 * 60;
  updateDisplay();
  totalFocusTime ();
})

// function to make sure distraction items increments 
function updateTotal() {
  let total = 0;
  // every count-val on the page and add them 
  document.querySelectorAll('.count-val').forEach(el => {
    total += parseInt(el.innerText);
  });
  // distraction-amount h6 
  document.querySelector('.distraction-amount').innerText = "Distraction(s): " + total;
}

function increment(btn) {
  // Find the specific span inside the clicked button
  const countSpan = btn.querySelector('.count-val');
  
  // Get current text convert to number & add 1
  let currentVal = parseInt(countSpan.innerText);
  countSpan.innerText = currentVal + 1;

  updateTotal();
}

distractionItem.forEach(item => {
  item.addEventListener("click", () => {
    increment(item); 
  });
});


// total time focus for the daty function 
function totalFocusTime (){
  // the math to get the total time 
  const minutes = Math.floor(totalFocus / 60);
  focusTotal.textContent = `Total Focus: ${minutes} min`;
  

}