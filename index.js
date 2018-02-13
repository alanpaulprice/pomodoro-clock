$(document).ready(() => {
  // Determine the length of the next timer periods.
  let breakLength = 5;
  let sessionLength = 25;
  // Used to count down, minutes set as length on start of new period.
  let minutes = 0;
  let seconds = 0;
  // Flags that keep track of what state the app is in: session in progress/fresh start,
  // currently counting down/paused or stopped, work session/on break.
  let newSession = true;
  let count = false;
  let working = true;
  // Alarm clock sound used to signal end of a period.
  let alarmAudio = new Audio("http://www.freesound.org/data/previews/198/198841_285997-lq.mp3");
  
  // ===== UPDATE DISPLAY =====
  
  function updateDisplay () {
    // Seconds stored as var to be edited if necessary.
    let tempSeconds = seconds;
    let status;
    // If seconds enters single digits, add a 0 infront. For example, 5 becomes 05.
    if (tempSeconds < 10) {
      tempSeconds = "0" + seconds;
    }
    // Depending on current period status (session or break), change theme to red or green.
    if (working) {
      status = "SESSION";
      $("body").css("background-color", "#BA1200");
      $(".btn i").css("color", "#BA1200");
    } else {
      status = "BREAK";
      $("body").css("background-color", "#A5C514"); // A5C514 006D34
      $(".btn i").css("color", "#A5C514");
    }
    // Updates the timer and status displays.
    $("#timer").text(minutes + ":" + tempSeconds);
    $("#status").text(status);
  }
  
  // ===== SET INTERVAL / TIMER =====
  // This function is always cycling. Whether or not it affects the app is determined by flag variables.
  let timer = setInterval(() => {
    // If count is true, count. Update display afterwards.
    if (count) {
      if (seconds === 0) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      // If the timer has run out, trigger alerts (animation/audio), flip working var value,
      // set new minutes value to that of sessionLength/breakLength, whichever is appropriate.
      if (minutes === 0 && seconds === 0) {
        
        $("#timer").effect("shake", {direction: "up", times: 41, distance: 10}, 4100);
        $("#status").effect("shake", {direction: "down", times: 41, distance: 10}, 4100);
        alarmAudio.play();
        seconds = 0;
        
        if (working === true) {
          working = false;
          minutes = breakLength;
        } else {
          working = true;
          minutes = sessionLength;
        }
      }
      
      updateDisplay();
    }
    
  }, 1000);

  // ===== BREAK MINUS =====
  // If breakLength is greater than 1, decrement BL and update it's readout.
  $("#breakMinus").click(() => {
    if (breakLength > 1) {
      breakLength--;
      $("#breakLength").text(breakLength);
    }
  });
  // ===== BREAK PLUS =====
  // If breakLength is less than 999, increment BL and update it's readout.
  $("#breakPlus").click(() => {
    if (breakLength < 999) {
      breakLength++;
      $("#breakLength").text(breakLength);
    }
  });
  // ===== SESSION MINUS =====
  // If sessionLength is greater than 1, decrement SL and update it's readout.
  // If no session in progress, also update #timer read out.
  $("#sessionMinus").click(() => {
    if (sessionLength > 1) {
      sessionLength--;
      $("#sessionLength").text(sessionLength);
      
      if (newSession) {
        $("#timer").text(sessionLength + ":00");
      }
    }
  });
  // ===== SESSION PLUS =====
  // If sessionLength is less than 999, increment SL and update it's readout.
  // If no session in progress, also update #timer read out.
  $("#sessionPlus").click(() => {
    if (sessionLength < 999) {
      sessionLength++;
      $("#sessionLength").text(sessionLength);
      
      if (newSession) {
        $("#timer").text(sessionLength + ":00");
      }
    }
  });

  // ===== PLAY/PAUSE/STOP =====
  // If no session in progress, set minutes to SL and flip newSession, flip count.
  $("#play").click(() => {
    if (newSession) {
      minutes = sessionLength;
      newSession = false;
    }
    count = true;
  });
  // Flip count.
  $("#pause").click(() => {
    count = false;
  });
  // Ends current session and resets app to default state.
  $("#stop").click(() => {
    count = false;
    newSession = true;
    working = true;
    minutes = sessionLength;
    seconds = 0;
    updateDisplay();
  });
})