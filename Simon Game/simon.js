let deviceOn = false;
let gameOn = false;
let gameOver = true;
let sequence = [];
let strict = true;
let round = 0;
let simonTurn = true;
let pleaseRepeat = false;

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
  round = 0;
}

// say
function say(message) {
  if (message == "Game Over!") document.querySelector("#lamps").removeEventListener("click", humanPlay);
  let msg = new SpeechSynthesisUtterance();
  let voices = window.speechSynthesis.getVoices();
  msg.voice = voices[10];
  msg.voiceUri = "native";
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 0.8;
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
  console.log(sequence);
}

// "User menu" input
function handleControls(element) {
  //Turning device ON/OFF
  if (element.target.id == "title") {
    if (!deviceOn) {
      deviceOn = true;
      say("Device is on");
      document.getElementById("title").style.animation = "none";
      document.getElementById("round").innerHTML = round;
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
      say("Device is off");
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
      say("Starting game");
      document.getElementById("strict").style.filter = "brightness(25%)";
      game();
    } else {
      initialize();
      say("Stopping game");
      document.getElementById("strict").style.filter = "brightness(100%)";
      document.getElementById("round").innerHTML = round;
    }
  }
  // Mode Selection STRICT/NORMAL
  if (element.target.id === "strict" && deviceOn && !gameOn) {
    if (!strict) {
      strict = true;
      document.getElementById("strict").innerHTML = "Strict Mode";
      say("Strict mode activated");
    } else {
      strict = false;
      document.getElementById("strict").innerHTML = "Normal mode";
      say("Normal mode activated");
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
    say("Game Over!");
    console.log("game over");
    initialize();
    document.getElementById("strict").style.filter = "brightness(100%)";
    document.getElementById("round").innerHTML = round;
  }
}

function simon() {
  console.log("Simon");
  document.querySelector("#lamps").removeEventListener("click", humanPlay);
  if (!pleaseRepeat) {
    generate();
    round++;
    document.getElementById("round").innerHTML = round;
  }
  let i = 0;
  while (i < round) {
    let el = sequence[i];
    setTimeout(show, i * 750, el);
    i++;
  }
  simonTurn = false;
  game();
}

let j

function human() {
  console.log("HUMAN");
  j = 0;
  document.querySelector("#lamps").addEventListener("click", humanPlay);
}

function humanPlay(element) {
  let selected = element.target.id;
  eval(`${selected}Sound`).play();
  if (j < round && selected == sequence[j]) { // Player guesses
    j++;
  } else if (j < round && selected != sequence[j] && strict) { // Player misses on STRICT Mode
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
  if (j == round) {
    simonTurn = true;
    setTimeout(game, 1000);
  }
}
document.addEventListener("click", handleControls);