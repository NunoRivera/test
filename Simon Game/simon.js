let deviceOn = false;
let gameOn = false;
let gameOver = true;
let sequence = [];
let strictMode = true;
let turn = 0;
let simonTurn = true;
let pleaseRepeat = false;
let j;

let redSound = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
);
let greenSound = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
);
let blueSound = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
);
let yellowSound = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
);

redSound.load();
greenSound.load();
yellowSound.load();
blueSound.load();

function initialize() {
  gameOn = false;
  gameOver = true;
  sequence = [];
  simonTurn = true;
  turn = 0;
}

// say
function say(message) {
  //  if (message == "Game Over!") {document.querySelector("#lamps").removeEventListener("click", humanPlay);};
  let msg = new SpeechSynthesisUtterance();
  let voices = window.speechSynthesis.getVoices();
  msg.voice = voices[1];
  msg.voiceUri = "Google UK English Male";
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 1;
  msg.text = message;
  msg.lang = "en-UK";
  speechSynthesis.speak(msg);
}

// show -> play sound, light up and clear
function show(color) {
  document.getElementById(color).style.filter = "brightness(200%)";
  eval(`${color}Sound`).play();
  setTimeout(() => document.getElementById(color).style.filter = "brightness(100%)", 500);
}

// Generate play sequence
function generate() {
  let x = Math.floor(Math.random() * 4);
  switch (x) {
    case 0:
      sequence.push("red");
      break;
    case 1:
      sequence.push("blue");
      break;
    case 2:
      sequence.push("green");
      break;
    case 3:
      sequence.push("yellow");
      break;
  }
}

// "User menu" input
function handleControls(element) {
  //Turning device ON/OFF
  if (element.target.id == "title") {
    if (!deviceOn) {
      deviceOn = true;
      if ('speechSynthesis' in window) {
        say("Device is on");
      }
      document.getElementById("title").style.animation = "none";
      document.getElementById("round").innerHTML = turn;
      document.getElementById("main").style.filter = "brightness(100%)";
      document.getElementById("strict").style.filter = "brightness(100%)";
      setTimeout(function () {
        show("red");
      }, 500);
      setTimeout(function () {
        show("green");
      }, 1000);
      setTimeout(function () {
        show("blue");
      }, 1500);
      setTimeout(function () {
        show("yellow");
      }, 2000);
    } else {
      if ('speechSynthesis' in window) {
        say("Device is off");
      }
      deviceOn = false;
      initialize();
      document.querySelector("#lamps").removeEventListener("click", humanPlay);
      document.getElementById("title").style.animation = "pulse 2s infinite";
      document.getElementById("main").style.filter = "brightness(25%)";
    }
  }
  // Starting/Stoping Game
  if (element.target.id === "start" && deviceOn) {
    if (!gameOn) {
      gameOn = true;
      gameOver = false;
      simonTurn = true;
      if ('speechSynthesis' in window) {
        say("Starting game");
      }
      document.getElementById("strict").style.filter = "brightness(25%)";
      game();
    } else {
      initialize();
      if ('speechSynthesis' in window) {
        say("Stopping game");
      }

      document.getElementById("strict").style.filter = "brightness(100%)";
      document.getElementById("round").innerHTML = turn;
    }
  }
  // Mode Selection STRICT/NORMAL
  if (element.target.id === "strict" && deviceOn && !gameOn) {
    if (!strictMode) {
      strictMode = true;
      document.getElementById("strict").innerHTML = "Strict Mode";
      if ('speechSynthesis' in window) {
        say("Strict mode activated");
      }
    } else {
      strictMode = false;
      document.getElementById("strict").innerHTML = "Normal mode";
      if ('speechSynthesis' in window) {
        say("Normal mode activated");
      }
    }
  }
}

// Game engine
function game() {
  if (!gameOver && simonTurn) {
    pleaseRepeat = false;
    simon();
  } else if (!gameOver && !simonTurn) human();
  if (gameOver) {
    if ('speechSynthesis' in window) {
      say("Game Over!");
    }
    initialize();
    document.getElementById("strict").style.filter = "brightness(100%)";
    document.getElementById("round").innerHTML = turn;
  }
}

function simon() {
  document.querySelector("#lamps").removeEventListener("click", humanPlay);
  if (!pleaseRepeat) {
    generate();
    turn++;
    document.getElementById("round").innerHTML = turn;
  }
  let i = 0;
  while (i < turn) {
    let el = sequence[i];
    setTimeout(show, i * 750, el);
    i++;
  }
  simonTurn = false;
  game();
}

function human() {
  j = 0;
  document.querySelector("#lamps").addEventListener("click", humanPlay);
}

function humanPlay(element) {
  let selected = element.target.id;
  eval(`${selected}Sound`).play();
  if (j < turn && selected == sequence[j]) { // Player guesses
    j++;
  } else if (j < turn && selected != sequence[j] && strictMode) { // Player misses on STRICT Mode
    gameOver = true;
    document.querySelector("#lamps").removeEventListener("click", humanPlay);
    j = null;
    game();
  } else { // Player misses on NORMAL Mode
    document.getElementById("strict").style.filter = "brightness(200%)";
    pleaseRepeat = true;
    setTimeout(simon, 1000);
    setTimeout(() => document.getElementById("strict").style.filter = "brightness(25%)", 1000);
  }
  if (j == turn) {
    simonTurn = true;
    setTimeout(game, 1000);
  }
}

// First we check if you support touch, otherwise it's click:
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
// Then we bind via that event.
document.addEventListener(touchEvent, handleControls);