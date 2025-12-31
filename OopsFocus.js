 // grabbing the element 
 
 const timerDisplay = document.getElementById("timer");
 const startBtn = document.getElementById("startBtn"); // start button 
 const pauseBtn = document.getElementById("pauseBtn"); // pause button 
 const resetBtn = document.getElementById("resetBtn"); // reset button 



 // the time we are starting with - 25 mn 

 let timeLeft = 25 * 60; // mn in sec 
 let timerInterval = 0;
 let isRunning = false;


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
});

// reset button 
resetBtn.addEventListener("click", () =>{
  clearInterval(timerInterval);
  isRunning = false;

  // reset back to 25 mn
  timeLeft = 25 * 60;
  updateDisplay();
})