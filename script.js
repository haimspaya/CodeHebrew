const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gridSize = 60;
const gridCount = 10;

const monkeyImg = new Image();
monkeyImg.src = "https://img.freepik.com/free-vector/expressive-cartoon-monkey-face-illustration_1308-180257.jpg";

const bananaImg = new Image();
bananaImg.src = "https://img.freepik.com/free-vector/simple-isolated-banana_1308-125007.jpg";

let level = 1;
let monkey = { x: 0, y: 0 };
let banana = { x: 9, y: 9 };
let obstacles = [];

function randomObstacles(count) {
  const obs = [];
  while (obs.length < count) {
    const ox = Math.floor(Math.random() * gridCount);
    const oy = Math.floor(Math.random() * gridCount);
    if ((ox !== 0 || oy !== 0) && (ox !== 9 || oy !== 9) && !obs.some(o => o.x === ox && o.y === oy)) {
      obs.push({ x: ox, y: oy });
    }
  }
  return obs;
}

function loadLevel(lvl) {
  monkey = { x: 0, y: 0 };
  banana = { x: 9, y: 9 };
  if (lvl === 1) {
    obstacles = [];
  } else if (lvl === 2) {
    obstacles = randomObstacles(15);
  }
  drawGame();
  document.getElementById("instructions").textContent = "נסה להזיז את הקוף אל הבננה 🍌";
}

function nextLevel() {
  level++;
  if (level > 2) level = 1;
  loadLevel(level);
}

function drawGrid() {
  ctx.strokeStyle = "#aaa";
  for (let i = 0; i <= gridCount; i++) {
    ctx.beginPath(); ctx.moveTo(i * gridSize + gridSize, gridSize); ctx.lineTo(i * gridSize + gridSize, 660); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gridSize, i * gridSize + gridSize); ctx.lineTo(660, i * gridSize + gridSize); ctx.stroke();
  }

  ctx.fillStyle = "#000";
  ctx.font = "18px sans-serif";
  for (let i = 0; i < gridCount; i++) {
    ctx.fillText(i, gridSize - 30, i * gridSize + gridSize + 35); // row numbers
    ctx.fillText(i, i * gridSize + gridSize + 25, gridSize - 20); // column numbers
  }
}

function isObstacle(x, y) {
  return obstacles.some(ob => ob.x === x && ob.y === y);
}

function drawGame() {
  ctx.clearRect(0, 0, 660, 660);
  drawGrid();

  ctx.fillStyle = "#000";
  for (const ob of obstacles) {
    ctx.fillRect(ob.x * gridSize + gridSize, ob.y * gridSize + gridSize, gridSize, gridSize);
  }

  ctx.drawImage(bananaImg, banana.x * gridSize + gridSize, banana.y * gridSize + gridSize, gridSize, gridSize);
  ctx.drawImage(monkeyImg, monkey.x * gridSize + gridSize, monkey.y * gridSize + gridSize, gridSize, gridSize);
}

function למעלה() {
  if (monkey.y > 0 && !isObstacle(monkey.x, monkey.y - 1)) monkey.y -= 1;
}
function למטה() {
  if (monkey.y < 9 && !isObstacle(monkey.x, monkey.y + 1)) monkey.y += 1;
}
function ימינה() {
  if (monkey.x < 9 && !isObstacle(monkey.x + 1, monkey.y)) monkey.x += 1;
}
function שמאלה() {
  if (monkey.x > 0 && !isObstacle(monkey.x - 1, monkey.y)) monkey.x -= 1;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function חזור(n, פעולה) {
  for (let i = 0; i < n; i++) {
    פעולה();
    drawGame();
    checkWin();
    await sleep(300);
  }
}

async function runCode() {
  const code = document.getElementById("code").value;
  try {
    const asyncCode = `(async () => { ${code} })()`;
    await eval(asyncCode);
    drawGame();
    checkWin();
  } catch (e) {
    alert("שגיאה בקוד: " + e.message);
  }
}

function checkWin() {
  if (monkey.x === banana.x && monkey.y === banana.y) {
    document.getElementById("instructions").textContent = "כל הכבוד! הקוף הגיע לבננה! 🍌🥳";
  } else {
    const dx = Math.abs(monkey.x - banana.x);
    const dy = Math.abs(monkey.y - banana.y);
    document.getElementById("instructions").textContent = `נשארו עוד ${dx + dy} צעדים לבננה.`;
  }
}

monkeyImg.onload = () => loadLevel(level);
bananaImg.onload = () => loadLevel(level);
