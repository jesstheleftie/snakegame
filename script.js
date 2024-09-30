//Global Variables
const boardSize = 15;
let snake = [
  { x: 3, y: 10 },
  { x: 2, y: 10 },
  { x: 1, y: 10 },
];
const firstApple = { x: 4, y: 10 };
let newApple = firstApple;
let direction = { x: 1, y: 0 };
let gameStatus = "running";
let score = 0;

// Game Functions

const generateRandomApple = () => {
  newApple = {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
 
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newApple.x && snake[i].y === newApple.y) {
      generateRandomApple();
    } else {
      return;
    }
  }
 
};

const snakeMove = () => {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
    gameStatus = "over";
    return;
  }
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameStatus = "over";
      return;
    }
  }
  snake.unshift(head);
  if (head.x === apple.x && head.y === apple.y) {
    generateRandomApple();
    score += 1;
  } else {
    snake.pop();
  }
};

//Event Listners
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    if (direction.y === 0) {
      direction = { x: 0, y: -1 };
    }
  } else if (event.key === "ArrowDown") {
    if (direction.y === 0) {
      direction = { x: 0, y: 1 };
    }
  } else if (event.key === "ArrowLeft") {
    if (direction.x === 0) {
      direction = { x: -1, y: 0 };
    }
  } else if (event.key === "ArrowRight") {
    if (direction.x === 0) {
      direction = { x: 1, y: 0 };
    }
  }
});
const render = () => {
  console.log("render");
  document.querySelectorAll(".tile").forEach((eachTile) => {
    console.log("each tile", eachTile);
    if (eachTile.classList.contains("snakeBody")) {
      eachTile.classList.remove("snakeBody");
    }
    if (eachTile.classList.contains("snakeHead")) {
      eachTile.classList.remove("snakeHead");
    }
    if (eachTile.classList.contains("redApple")) {
      eachTile.classList.remove("redApple");
    }
  });

  snake.forEach((body, index) => {
    let snakeTile = document.getElementById(`${body.x},${body.y}`);
    if (snakeTile) {
      if (index === 0) {
        snakeTile.classList.add("snakeHead");
      } else {
        snakeTile.classList.add("snakeBody");
      }
    }
  });

  let newAppleBox = document.getElementById(`${newApple.x},${newApple.y}`);
  if (newAppleBox) {
    newAppleBox.classList.add("redApple");
  }
};

render();
