let sequence = [];
let deviceOn = false;
let gameOn = false;
let strict = false;
let round = 0;
let gameOver = true;

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

// say
function say(m) {
  let msg = new SpeechSynthesisUtterance();
  let voices = window.speechSynthesis.getVoices();
  msg.voice = voices[10];
  msg.voiceUri = "native";
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 0.8;
  msg.text = m;
  msg.lang = "en-UK";
  speechSynthesis.speak(msg);
}

// show and play
function show(color) {
  document.getElementById(color).style.filter = "brightness(200%)";
  eval(`${color}Sound`).play();
  setTimeout(() => clear(color), 1000);
}

function clear(color) {
  document.getElementById(color).style.filter = "brightness(100%)";
}

// Generate play
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

// read user menu input
function handleControls(element) {
  if (element.target.id == "title") {
    if (deviceOn === false) {
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
      }, 1500);
      setTimeout(function () {
        show("blue");
      }, 2500);
      setTimeout(function () {
        show("yellow");
      }, 3500);
    } else {
      deviceOn = false;
      say("Device is off");
      document.getElementById("title").style.animation = "pulse 2s infinite";
      document.getElementById("main").style.filter = "brightness(25%)";
      sequence = [];
      deviceOn = false;
      gameOn = false;
      round = 0;
      gameOver = true;
    }
  }
  if (element.target.id === "start" && deviceOn === true) {
    if (gameOn === false) {
      gameOn = true;
      gameOver = false;
      say("Starting game");
      document.getElementById("strict").style.filter = "brightness(25%)";
      game();
    } else {
      gameOn = false;
      gameOver = true;
      say("Stopping game");
      document.getElementById("strict").style.filter = "brightness(100%)";
      sequence = [];
      round = 0;
      document.getElementById("round").innerHTML = round;
    }
  }
  if (element.target.id === "strict" && deviceOn === true && gameOn === false) {
    if (strict === false) {
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
let simonTurn = true;

function game() {
  if (!gameOver && round < 5) {
    simon();
    /*     document.addEventListener("click", humanPlay, false);
     */
    human();
  } else {
    say("Game Over!");
    gameOn = false;
    gameOver = true;
    document.getElementById("strict").style.filter = "brightness(100%)";
    sequence = [];
    round = 0;
    document.getElementById("round").innerHTML = round;
  }

}

function simon() {
  console.log("Simon");
  document.removeEventListener("click", handleControls);
  generate();
  round++;
  document.getElementById("round").innerHTML = round;
  let i = 0;
  while (i < round) {
    let e = sequence[i];
    setTimeout(function () {
      show(e);
    }, i * 1500);
    i++;
  }
  simonTurn = false;
  human();
}

function human() {
  console.log("HUMAN");
  document.querySelector("#lamps").addEventListener("click", humanPlay, false);
}

function humanPlay(element) {
  let selected = element.target.id;
  console.log(selected, sequence[j]);
  let j = 0;
  if (j < round && selected == sequence[j]) {
    j++;
    human();
  } else if (selected == sequence[j]) {
    gameOver = true;
    game();
  } else if (j == round) simon();


  /*   while (i < round) {
      if (selected == sequence[i]) {
        i++;
      } else {
        gameOver = true;
        game();
      }
    } */

}
document.addEventListener("click", handleControls, false);