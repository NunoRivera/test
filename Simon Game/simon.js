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

// Show
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

function show(color) {

  document.getElementById(color).style.filter = "brightness(200%)";

  //document.getElementById(color).style.animation = "a" + color + " 700ms";
  eval(color + "Sound").play();
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
      document.getElementById("red").style.filter = "brightness(90%)";

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

document.addEventListener("click", handleControls, false);

function simon() {
  console.log("Simon");
  generate();
  round++;
  document.getElementById("round").innerHTML = round;
  let i = 0;
  while (i < round) {
    let e = sequence[i];
    setTimeout(function () {
      // say(e);
      // document.getElementById(e).style.animation = "none";
      show(e);
      console.log(e);
    }, i * 1000);
    document.getElementById(e).style.filter = "brightness(50%)";
    i++;
  }
}

// Game engine
function game() {
  round = 0;
  // while (!gameOver) {
  //   document.removeEventListener("click", handleControls);
  //   simon();
  //   document.addEventListener("click", handleControls);
  //   human();
  // }
  simon();
  human();
}


function human() {
  console.log("HUMAN");
  document.querySelector("#lamps").addEventListener("click", humanPlay, false);
}

function humanPlay(element) {
  let selected = element.target.id;
  console.log(selected);
  let i = 0;
  while (i < round) {
    if (selected == sequence[i]) {
      human();
    } else gameOver = true;
    i++;
  }
  simon();
}