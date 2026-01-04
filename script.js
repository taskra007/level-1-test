// ================== 🎵 SOUNDS ==================
const bgSound = new Audio("sounds/bg.mp3");
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const bombSound = new Audio("sounds/bomb.mp3");
const missSound = new Audio("sounds/miss.mp3");

bgSound.loop = true;
bgSound.volume = 0.4;
correctSound.volume = 0.8;
wrongSound.volume = 0.8;
bombSound.volume = 0.9;
missSound.volume = 0.7;

// ================== 🎮 ELEMENTS ==================
const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");
const loveText = document.getElementById("loveText");
const hint = document.getElementById("hint");
const endPopup = document.getElementById("endPopup");
const endMsg = document.getElementById("endMsg");


// ================== ⚙️ GAME STATE ==================
let score = 0;
let lives = 3;
let timeLeft = 360;
let speed = 900;
let spawnInt = null;
let timerInt = null;
let trueHeart = null;

const WIN_SCORE = 50;

// ================== ❤️ HEART IMAGES ==================
const heartImages = {
  true: "true-heart.png",
  fake: "fake-heart.png",
  bad: "bad-heart.png",
  bomb: "bomb.png"
};

// ================== ❤️ SPAWN HEART ==================
function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";

  const r = Math.random();
  let type =
    r < 0.4 ? "true" :
    r < 0.6 ? "fake" :
    r < 0.8 ? "bad" : "bomb";

  h.innerHTML = `<img src="${heartImages[type]}" class="heart-img">`;

  if (type === "true") trueHeart = h;

  h.style.left = Math.random() * 85 + "vw";
  h.style.animationDuration = speed / 200 + "s";

  let clicked = false;

  h.addEventListener("click", () => {
    if (clicked) return;
    clicked = true;
    clickHeart(type, h);
  });

  h.addEventListener("animationend", () => {
    if (!clicked) {
      h.remove();
      missSound.currentTime = 0;
      missSound.play();
      if (type === "true") increaseSpeed();
    }
  });

  gameArea.appendChild(h);
}

// ================== 🖱 CLICK HEART ==================
function clickHeart(type, h) {
  if (type === "true") {
    score += 2.5;
    correctSound.currentTime = 0;
    correctSound.play();
    showLove();
  } else if (type === "fake") {
    wrongSound.currentTime = 0;
    wrongSound.play();
    showHint();
    glowTrueHeart();
  } else if (type === "bad") {
    wrongSound.currentTime = 0;
    wrongSound.play();
    lives--;
  } else {
    bombSound.currentTime = 0;
    bombSound.play();
    lives -= 2;
  }

  h.remove();
  updateHUD();

  if (score >= WIN_SCORE) winGame();
  if (lives <= 0) endGame();
}

// ================== ⚡ SPEED ==================
function increaseSpeed() {
  if (speed > 500) {
    speed -= 40;
    restartSpawner();
  }
}

function restartSpawner() {
  clearInterval(spawnInt);
  spawnInt = setInterval(spawnHeart, speed);
}

// ================== ✨ EFFECTS ==================
function glowTrueHeart() {
  if (!trueHeart) return;
  trueHeart.classList.add("glow");
  setTimeout(() => trueHeart.classList.remove("glow"), 1200);
}

function showLove() {
  loveText.classList.remove("showLove");
  void loveText.offsetWidth;
  loveText.classList.add("showLove");
}

function showHint() {
  hint.classList.remove("showHint");
  void hint.offsetWidth;
  hint.classList.add("showHint");
}

// ================== 🧾 HUD ==================
function updateHUD() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}

// ================== ▶ START GAME ==================
function startGame() {
  const themes = [
  "theme-neon",
  "theme-cute",
  "theme-valentine"
];
[bgSound, correctSound, wrongSound, bombSound, missSound].forEach(s => {
  s.muted = false;
  s.play().catch(() => {});
  s.pause();
  s.currentTime = 0;
});


setTheme(themes[Math.floor(Math.random() * themes.length)]);

  // 🔥 HIDE START SCREEN (THIS WAS MISSING)
  document.getElementById("startScreen").style.display = "none";

  // 🔊 Start background sound
  bgSound.currentTime = 0;
  bgSound.play().catch(() => {});

  // 🧹 Reset state
  score = 0;
  lives = 3;
  timeLeft = 360;
  speed = 900;

  updateHUD();
  timeEl.textContent = "06:00";
  endPopup.style.display = "none";

  clearInterval(spawnInt);
  clearInterval(timerInt);

  // ❤️ START GAME
  spawnInt = setInterval(spawnHeart, speed);
  timerInt = setInterval(updateTime, 1000);
}

// ================== ⏱ TIME ==================
function updateTime() {
  timeLeft--;
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  timeEl.textContent = `${m}:${s.toString().padStart(2, "0")}`;
  if (timeLeft <= 0) endGame();
}

// ================== 🏁 END ==================
function winGame() {
  clearInterval(spawnInt);
  clearInterval(timerInt);
  bgSound.pause();
  endPopup.style.display = "flex";
  endMsg.textContent = "🎉 YOU WIN ❤️";
}

function endGame() {
  clearInterval(spawnInt);
  clearInterval(timerInt);
  bgSound.pause();
  endPopup.style.display = "flex";
  endMsg.textContent = "GAME OVER 💔";
}

// ================== 🔘 BUTTON ==================
startBtn.addEventListener("click", startGame);
function setTheme(theme) {
  document.body.className = theme;
}
function setTheme(theme) {
  document.body.className = "";
  document.body.classList.add(theme);
}
const resetBtn = document.getElementById("resetBtn");
const passBtn = document.getElementById("passBtn");

resetBtn.addEventListener("click", resetGame);
passBtn.addEventListener("click", passHearts);
function resetGame() {
  clearInterval(spawnInt);
  clearInterval(timerInt);

  gameArea.innerHTML = "";

  score = 0;
  lives = 3;
  timeLeft = 360;
  speed = 900;

  updateHUD();
  timeEl.textContent = "06:00";

  spawnInt = setInterval(spawnHeart, speed);
  timerInt = setInterval(updateTime, 1000);
}
function passHearts() {
  const hearts = document.querySelectorAll(".heart");

  hearts.forEach(h => h.remove());

  // penalty for passing
  lives--;
  updateHUD();

  if (lives <= 0) endGame();
}
let passCooldown = false;

function passHearts() {
  if (passCooldown) return;
  passCooldown = true;

  document.querySelectorAll(".heart").forEach(h => h.remove());
  lives--;
  updateHUD();

  setTimeout(() => passCooldown = false, 2000);

  if (lives <= 0) endGame();
}
function passHearts() {
  wrongSound.currentTime = 0;
  wrongSound.play();

  document.querySelectorAll(".heart").forEach(h => h.remove());

  lives--;
  updateHUD();

  if (lives <= 0) endGame();
}

