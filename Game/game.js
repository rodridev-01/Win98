const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartContainer = document.getElementById('restartContainer');

// Cargar imagen del pájaro
let birdImage = new Image();
birdImage.src = 'Game/bird.png'; 

// Cargar imagen del tubo
let pipeImage = new Image();
pipeImage.src = 'Game/tramp.png'; 

let bird, pipes, frame, gameOver, gameStarted;

function initializeGame() {
  bird = {
    x: 50,
    y: canvas.height / 2,
    width: 24,
    height: 24,
    gravity: 0.45,
    lift: -6,
    velocity: 0
  };
  pipes = [];
  frame = 0;
  gameOver = false;
  gameStarted = false;
  restartContainer.style.display = 'none';  
  drawStartScreen();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (!gameStarted) startGame();
    bird.velocity = bird.lift;
  }
});

canvas.addEventListener('click', () => {
  if (!gameStarted) startGame();
  bird.velocity = bird.lift;
});

function startGame() {
  gameStarted = true;
  bird.velocity = bird.lift;
  gameLoop();
}

function restartGame() {
  initializeGame();
}

function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  for (let pipe of pipes) {
    ctx.save();
    ctx.translate(pipe.x + pipe.width / 2, pipe.top);
    ctx.scale(1, -1);
    ctx.drawImage(pipeImage, -pipe.width / 2, 0, pipe.width, pipe.top);
    ctx.restore();

    ctx.drawImage(pipeImage, pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  }
}

function updatePipes() {
  if (frame % 100 === 0) {
    let top = Math.random() * (canvas.height / 2) + 20;
    let gap = 90;
    pipes.push({
      x: canvas.width,
      width: 40,
      top: top,
      bottom: top + gap
    });
  }

  for (let pipe of pipes) {
    pipe.x -= 2;
  }

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function checkCollision() {
  for (let pipe of pipes) {
    if (bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)) {
      gameOver = true;
    }
  }
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

function gameLoop() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    updatePipes();

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    checkCollision();

    frame++;
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "24px monospace";
    
    const text = "GAME OVER";
    const textWidth = ctx.measureText(text).width;
    const textHeight = 20; 
    
    const xPosition = (canvas.width - textWidth) / 2;
    const yPosition = (canvas.height - textHeight) / 2;

    // Dibuja el texto centrado
    ctx.fillText(text, xPosition, yPosition);

    restartContainer.style.display = 'block'; 
  }
}

function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBird();

  ctx.fillStyle = "black";
  ctx.font = "14px monospace";
  ctx.fillText("Presiona espacio o clic", 60, 180);
}

initializeGame();
