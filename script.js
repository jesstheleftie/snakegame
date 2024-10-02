//Global Variables
const boardSize = 15;
let snake = [
  { x: 3, y: 10 },
  { x: 2, y: 10 },
  { x: 1, y: 10 },
];
const firstApple = { x: 9, y: 10 };
let newApple = firstApple;
let direction = { x: 1, y: 0 };
let headDirection = "right";
let gameStatus = "running";
let score = 0;

// Board Creation Functions

const createBoard = () => {
  const board = document.getElementById("board");
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const boardBox = document.createElement("div");
      boardBox.classList.add("board-box");
      boardBox.id = `${x},${y}`;
      board.appendChild(boardBox);
    }
  }
};

createBoard();

// Game Functions

const generateRandomApple = () => {
  newApple = {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
  console.log("newApple", newApple);
  let isOnSnake = false;

  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newApple.x && snake[i].y === newApple.y) {
      isOnSnake = true;
    }
  }

  if (isOnSnake) {
    generateRandomApple();
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

  if (head.x === newApple.x && head.y === newApple.y) {
    generateRandomApple();
    score += 1;
    let updatedScore = document.querySelector('#score')
        updatedScore.innerText= `SCORE: ${score}`
  } else {
    snake.pop();
  }
  console.log("snake", snake);
};

snakeMove();

//Event Listners
window.addEventListener("keydown", (event) => {
  let snakeHead = document.querySelector(".snakeHead");
  if (event.key === "ArrowUp") {
    if (direction.y === 0) {
      direction = { x: 0, y: -1 };
    }
    headDirection = "up";
    snakeHead.style.transform = "rotate(0deg)";
  } else if (event.key === "ArrowDown") {
    if (direction.y === 0) {
      direction = { x: 0, y: 1 };
    }
    headDirection = "down";
    snakeHead.style.transform = "rotate(180deg)";
  } else if (event.key === "ArrowLeft") {
    if (direction.x === 0) {
      direction = { x: -1, y: 0 };
    }
    headDirection = "left";
    snakeHead.style.transform = "rotate(270deg)";
  } else if (event.key === "ArrowRight") {
    if (direction.x === 0) {
      direction = { x: 1, y: 0 };
    }
    headDirection = "right";
    snakeHead.style.transform = "rotate(90deg)";
  }
});

const tailDirection = () => {
  let snakeTail = snake[snake.length - 1];
  let snakeSecondLast = snake[snake.length - 2];
  let result = "";
  if (snakeTail.x === snakeSecondLast.x) {
    //look at y
    if (snakeTail.y - snakeSecondLast.y < 0) {
      result = "up";
    } else {
      result = "down";
    }
  } else {
    //look at x
    if (snakeTail.x - snakeSecondLast.x < 0) {
      result = "left";
    } else {
      result = "right";
    }
  }
  return result;
};




//function to render update to DOM
const render = () => {
  console.log("render");
  document.querySelectorAll(".board-box").forEach((eachTile, index) => {
    if (eachTile.classList.contains("snakeBody")) {
      eachTile.classList.remove("snakeBody");
    }
    if (eachTile.classList.contains("snakeTail")) {
      eachTile.classList.remove("snakeTail");
    }
    if (eachTile.classList.contains("snakeHead")) {
      eachTile.classList.remove("snakeHead");
    }
    if (eachTile.classList.contains("redApple")) {
      eachTile.classList.remove("redApple");
    }
    eachTile.innerText = "";
  });

  snake.forEach((body, index) => {
    let snakeTile = document.getElementById(`${body.x},${body.y}`);
    if (snakeTile) {
      if (index === 0) {
        snakeTile.classList.add("snakeHead");

        if (headDirection === "up") {
          snakeTile.style.transform = "rotate(0deg)";
        } else if (headDirection === "down") {
          snakeTile.style.transform = "rotate(180deg)";
        } else if (headDirection === "left") {
          snakeTile.style.transform = "rotate(270deg)";
        } else if (headDirection === "right") {
          snakeTile.style.transform = "rotate(90deg)";
        }
      } else {
        snakeTile.classList.add("snakeBody");
        if (snake.length - 1 === index) {
          snakeTile.classList.add("snakeTail");
          const directionOfTail = tailDirection();
          if (directionOfTail === "up") {
            snakeTile.style.transform = "rotate(0deg)";
          }
          if (directionOfTail === "right") {
            snakeTile.style.transform = "rotate(90deg)";
          }
          if (directionOfTail === "down") {
            snakeTile.style.transform = "rotate(180deg)";
          }
          if (directionOfTail === "left") {
            snakeTile.style.transform = "rotate(270deg)";
          }
        }
      }
      //draw eyes
      let headElement = document.querySelector(".snakeHead");
      if (headElement && !headElement.hasChildNodes()) {
        let eyeBox = document.createElement("div");
        eyeBox.classList.add("eyeBox");
        let leftEyeBall = document.createElement("span");
        leftEyeBall.classList.add("eyeBall");
        let rightEyeBall = document.createElement("span");
        rightEyeBall.classList.add("eyeBall");
        eyeBox.appendChild(leftEyeBall);
        eyeBox.appendChild(rightEyeBall);
        headElement.appendChild(eyeBox);
      }
    }
  });

  let newAppleBox = document.getElementById(`${newApple.x},${newApple.y}`);
  if (newAppleBox) {
    newAppleBox.classList.add("redApple");
  }
};

render();

//game loop

const gameLoop = () => {
  if (gameStatus === "over") {
    console.log("Game Over!!!!");
    return;
  }

  console.log("Game loop is running");
  console.log("current snake posisiton", snake);
  console.log("current Apple position", newApple);

  if (gameStatus === "running") snakeMove();
  render();
  setTimeout(gameLoop, 1000-(score*20));
};

gameLoop();

