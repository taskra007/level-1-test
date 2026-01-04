const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");
const loveText = document.getElementById("loveText");
const hint = document.getElementById("hint");
const endPopup = document.getElementById("endPopup");
const endMsg = document.getElementById("endMsg");

let score = 0, lives = 3, timeLeft = 360;
speed = 700; // faster spawn
spawnInt = setInterval(spawnHeart, speed);

let trueHeart = null;
const WIN_SCORE = 50;

const heartImages = {
  "true": "true-heart.png",   // correct heart
  "fake": "fake-heart.png",   // fake
  "bad": "bad-heart.png",     // bad heart
  "bomb": "bomb.png"          // bomb
};

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";

  const r = Math.random();
  let type;
  if(r < 0.4) type = "true";
  else if(r < 0.6) type = "fake";
  else if(r < 0.8) type = "bad";
  else type = "bomb";

  h.innerHTML = `<img src="${heartImages[type]}" class="heart-img">`;

  if(type === "true") trueHeart = h;

  h.style.left = Math.random() * 85 + "vw";
  h.style.animationDuration = speed / 200 + "s";

  let clicked = false;
  h.addEventListener("click", () => {
    if(clicked) return;
    clicked = true;
    clickHeart(type, h);
  });

  gameArea.appendChild(h);

  h.addEventListener('animationend', () => {
    if(!clicked) {
      h.remove();
      if(type === "true") increaseSpeed(); // speed up if correct heart missed
    }
  });
}

function clickHeart(type, h) {
  if(type === "true") {
    score+=2.5;
    showLove();
  } else if(type === "fake") {
    showHint();
  } else if(type === "bad") {
    lives--;
  } else if(type === "bomb") {
    lives -= 2;
  }

  h.remove();
  updateHUD();

  if(score >= WIN_SCORE) winGame();
  if(lives <= 0) endGame();
}

function increaseSpeed() {
  if(speed > 350) {
    speed -= 30;
    restartSpawner();
  }
}

function restartSpawner() {
  clearInterval(spawnInt);
  spawnInt = setInterval(spawnHeart, speed);
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

function updateHUD() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}

function startGame() {
  startBtn.style.display = "none";
  score = 0; lives = 3; timeLeft = 360; speed = 900;
  updateHUD();
  timeEl.textContent = "06:00";
  endPopup.style.display = "none";

  spawnInt = setInterval(spawnHeart, speed);
  timerInt = setInterval(updateTime, 1000);
}

function updateTime() {
  timeLeft--;
  let m = Math.floor(timeLeft / 60);
  let s = timeLeft % 60;
  timeEl.textContent = `${m}:${s.toString().padStart(2,"0")}`;
  if(timeLeft <= 0) endGame();
}

function winGame() {
  clearInterval(spawnInt);
  clearInterval(timerInt);
  endPopup.style.display = "flex";
  endMsg.textContent = "🎉 YOU WIN THE GAME ❤️";
}

function endGame() {
  clearInterval(spawnInt);
  clearInterval(timerInt);
  endPopup.style.display = "flex";
  endMsg.textContent = "GAME OVER 💔";
}

startBtn.addEventListener("click", startGame);
