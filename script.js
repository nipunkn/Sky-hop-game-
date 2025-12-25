const menu = document.getElementById("menu");
const playBtn = document.getElementById("playBtn");
const game = document.getElementById("game");
const bird = document.getElementById("bird");
const birdImg = document.getElementById("birdImg");
const scoreText = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const menuBtn = document.getElementById("menuBtn");

let W = window.innerWidth;
let H = window.innerHeight;

let birdY = 0;
let velocity = 0;
let gravity = 0.8;
let jump = -12;
let pipeSpeed = 4;
let pipeGap = 180;

let running = false;
let pipeTimer;
let score = 0;
let settings;


playBtn.onclick = () => {
  settings = {
    difficulty: difficulty.value,
    birdColor: birdColor.value,
    background: background.value
  };

  birdImg.src = `birds/${settings.birdColor}.png`;
  game.className = settings.background;

  menu.classList.add("hidden");
  gameOver.classList.add("hidden");
  game.classList.remove("hidden");

  startGame();
};


function startGame() {
  document.querySelectorAll(".pipe").forEach(p => p.remove());

  birdY = H * 0.4;
  velocity = 0;
  score = 0;
  scoreText.textContent = "0";

  bird.style.top = birdY + "px";
  bird.style.transform = "rotate(0deg)";

  running = true;

  clearInterval(pipeTimer);
  pipeTimer = setInterval(() => running && spawnPipe(), 1500);

  requestAnimationFrame(loop);
}


function loop() {
  if (!running) return;

  velocity += gravity;
  birdY += velocity;

  bird.style.transform =
    `rotate(${Math.max(-20, Math.min(velocity * 2, 20))}deg)`;


  if (birdY <= 0 || birdY + bird.offsetHeight >= H) {
    endGame();
    return;
  }

  bird.style.top = birdY + "px";
  requestAnimationFrame(loop);
}


function spawnPipe() {
  const topH = Math.random() * (H - pipeGap - 200) + 100;

  const top = document.createElement("div");
  const bottom = document.createElement("div");

  top.className = "pipe top";
  bottom.className = "pipe bottom";

  top.style.height = topH + "px";
  bottom.style.height = H - topH - pipeGap + "px";

  let x = W + 120;
  let scored = false;

  game.append(top, bottom);

  function move() {
    if (!running) return;

    x -= pipeSpeed;
    top.style.left = bottom.style.left = x + "px";

    
    if (!scored && x + top.offsetWidth < bird.offsetLeft) {
      scored = true;
      score++;
      scoreText.textContent = score;
    }

   
    if (checkCollision(top) || checkCollision(bottom)) {
      endGame();
      return;
    }

    if (x < -120) {
      top.remove();
      bottom.remove();
      return;
    }

    requestAnimationFrame(move);
  }

  move();
}


function checkCollision(pipe) {
  const b = bird.getBoundingClientRect();
  const p = pipe.getBoundingClientRect();

 
  const paddingX = b.width * 0.2;
  const paddingY = b.height * 0.2;

  const birdBox = {
    left: b.left + paddingX,
    right: b.right - paddingX,
    top: b.top + paddingY,
    bottom: b.bottom - paddingY
  };

  return !(
    birdBox.right < p.left ||
    birdBox.left > p.right ||
    birdBox.bottom < p.top ||
    birdBox.top > p.bottom
  );
}


function endGame() {
  if (!running) return;
  running = false;
  clearInterval(pipeTimer);
  gameOver.classList.remove("hidden");
}

function flap() {
  if (!running) {
    gameOver.classList.add("hidden");
    startGame();
    return;
  }
  velocity = jump;
}

document.addEventListener("keydown", e => {
  if (e.code === "Space" || e.code === "Enter") flap();
  if (e.code === "Escape") location.reload();
});

document.addEventListener("click", flap);
document.addEventListener("touchstart", flap);
menuBtn.onclick = () => location.reload();
