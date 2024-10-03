
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
let gameStatus = "";
let score = 0;
let firstStart = true;
let snakeAlive = true;
let localHighScore = localStorage.getItem("highScore") || 0;
let initialLocalHighScore = localStorage.getItem("highScore") || 0;
document.getElementById(
  "high-score-2"
).innerText = `HIGH SCORE: ${initialLocalHighScore}`;

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
//Function to add sounds
// Chomp sound
const appleSound = new Audio("chomp.mp3");
const playAppleSound = () => {
  appleSound.play();
};

//Game over sound
const gameOverSound = new Audio("game-over.mp3");
const playGameOverSound = () => {
  gameOverSound.play();
};

//Beat High Score sound
const beatHighScoreSound = new Audio("level-up.mp3");
const playBeatHighScoreSound =()=>{
    beatHighScoreSound.play();
};

//Functions for sound on and off 
const soundButton = document.querySelector('#sound-button')
const soundIcon = document.querySelector('#sound-img')


soundButton.addEventListener('click',()=>{
if (soundButton.classList.contains('sound-on')){
    soundButton.classList.remove('sound-on');
    soundButton.classList.add('sound-off');
    soundIcon.src="https://img.icons8.com/material-rounded/24/no-audio--v1.png"
    soundIcon.alt="sound off image"
    appleSound.muted = true
    gameOverSound.muted = true
    beatHighScoreSound.muted = true
} else {
    soundButton.classList.remove('sound-off')
    soundButton.classList.add('sound-on')
    soundIcon.src="https://img.icons8.com/material-rounded/24/speaker.png"
    soundIcon.alt="sound on image"
    appleSound.muted = false
    gameOverSound.muted = false
    beatHighScoreSound.muted = false
}
})
// Snake movement function, responsible for snake moving,game-over conditions,score and reset
const snakeMove = () => {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  let gameOverContainer = document.querySelector("#gameover-container");
  let yourScoreElement = document.querySelector(`#your-score`);
  let highscoreElement = document.querySelector("#high-score");
  localHighScore = localStorage.getItem("highScore") || 0;
  let beatHighScoreMessageElement = document.querySelector('#beat-high-score-message');

  if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
    gameStatus = "";
    snakeAlive = false;
    playGameOverSound();
    setTimeout(() => {
      gameOverContainer.style.display = "inherit";
      highscoreElement.innerText = `HIGH SCORE: ${localHighScore}`;
      yourScoreElement.innerText = `Your Score: ${score}`;
      firstStart = false;
      if (score>initialLocalHighScore){
        playBeatHighScoreSound();
        beatHighScoreMessageElement.innerText=`You beat the high score!`
        party.confetti(gameOverContainer), {
            count: party.variation.range(20, 40),
            spread:60
          };
      } else {beatHighScoreMessageElement.innerText=""}
    }, 500);
    return;
  }
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameStatus = "";
      snakeAlive = false;
      playGameOverSound();
      setTimeout(() => {
        gameOverContainer.style.display = "inherit";
        highscoreElement.innerText = `HIGH SCORE: ${localHighScore}`;
        yourScoreElement.innerText = `Your Score: ${score}`;
        firstStart = false;
        if (score>initialLocalHighScore){
            playBeatHighScoreSound();
            beatHighScoreMessageElement.innerText=`You beat the high score!`
            party.confetti(gameOverContainer), {
                count: party.variation.range(20, 40),
                spread:60
              };
            
          } else {beatHighScoreMessageElement.innerText=""}
      }, 500);
      return;
    }
  }
  snake.unshift(head);

  if (head.x === newApple.x && head.y === newApple.y) {
    generateRandomApple();
    score += 1;
    playAppleSound();
    let updatedScore = document.querySelector("#score");
    updatedScore.innerText = `SCORE: ${score}`;
    const highScore = localStorage.getItem("highScore");

    if (!highScore || score > highScore) {
      localStorage.setItem("highScore", score);

    }
  } else {
    snake.pop();
  }
};

snakeMove();

//Event Listners for user keyboard to snake movement and start of game
window.addEventListener("keydown", (event) => {
  let snakeHead = document.querySelector(".snakeHead");
  let directionOfNeck = neckDirection();
  let message = document.querySelector("#start-message");
  if (!snakeAlive) {
    return;
  }
  if (
    event.key === "ArrowUp" &&
    ((directionOfNeck !== "up" && direction.y === 0) || gameStatus === "")
  ) {
    direction = { x: 0, y: -1 };
    headDirection = "up";
    snakeHead.style.transform = "rotate(0deg)";
    message.style.display = "none";
    gameStatus = "running";
  } else if (
    event.key === "ArrowRight" &&
    ((directionOfNeck !== "right" && direction.x === 0) || gameStatus === "")
  ) {
    direction = { x: 1, y: 0 };
    headDirection = "right";
    snakeHead.style.transform = "rotate(90deg)";
    message.style.display = "none";
    gameStatus = "running";
  } else if (
    event.key === "ArrowDown" &&
    ((directionOfNeck !== "down" && direction.y === 0) || gameStatus === "")
  ) {
    direction = { x: 0, y: 1 };
    headDirection = "down";
    snakeHead.style.transform = "rotate(180deg)";
    message.style.display = "none";
    gameStatus = "running";
  } else if (
    event.key === "ArrowLeft" &&
    directionOfNeck !== "left" &&
    direction.x === 0
  ) {
    direction = { x: -1, y: 0 };
    headDirection = "left";
    snakeHead.style.transform = "rotate(270deg)";
    message.style.display = "none";
    gameStatus = "running";
  }
});

//set event listener for hit enter in game over container
window.addEventListener ('keydown',(event)=>{
    let gameOverContainer = document.querySelector("#gameover-container");
    
    if(event.key === 'Enter' && gameOverContainer.style.display === "inherit"){
  gameOverContainer.style.display = "none";
  let startMessage = document.querySelector("#start-message");
  startMessage.style.display = "inherit";
  gameStatus = "";
  snakeAlive = true;
  headDirection = "right";
  score = 0;
  let updatedScore = document.querySelector("#score");
  updatedScore.innerText = `SCORE: ${score}`;
  snake = [
    { x: 3, y: 10 },
    { x: 2, y: 10 },
    { x: 1, y: 10 },
  ];
  //highscore storage and display
  initialLocalHighScore = localHighScore;
  document.getElementById(
    "high-score-2"
  ).innerText = `HIGH SCORE: ${initialLocalHighScore}`;
  newApple = firstApple;
  direction = { x: 1, y: 0 };
  render();
    }
})
let button = document.getElementById(`play-again`);
button.addEventListener("click", () => {
  let gameOverContainer = document.querySelector("#gameover-container");
  gameOverContainer.style.display = "none";
  let startMessage = document.querySelector("#start-message");
  startMessage.style.display = "inherit";
  gameStatus = "";
  snakeAlive = true;
  headDirection = "right";
  score = 0;
  let updatedScore = document.querySelector("#score");
  updatedScore.innerText = `SCORE: ${score}`;
  snake = [
    { x: 3, y: 10 },
    { x: 2, y: 10 },
    { x: 1, y: 10 },
  ];
  //highscore storage and display
  initialLocalHighScore = localHighScore;
  document.getElementById(
    "high-score-2"
  ).innerText = `HIGH SCORE: ${initialLocalHighScore}`;
  newApple = firstApple;
  direction = { x: 1, y: 0 };
  render();
});
//function to show direction of rounded tail
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

//function to show direction of head with restriction of 180degrees facing neck
const neckDirection = () => {
  let snakeHead = snake[0];
  let snakeSecond = snake[1];
  let result = "";
  if (snakeHead.x === snakeSecond.x) {
    //look at y
    if (snakeHead.y - snakeSecond.y > 0) {
      result = "up";
    } else {
      result = "down";
    }
  } else {
    //look at x
    if (snakeHead.x - snakeSecond.x > 0) {
      result = "left";
    } else {
      result = "right";
    }
  }
  return result;
};

//function to render update to DOM
const render = () => {
  //function to remove old tiles
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

  //redraw new tiles and snake with the most updated variables
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
      //drawing the eyes on the snake head and making them squint when hits wall or body
      let headElement = document.querySelector(".snakeHead");
      if (headElement && !headElement.hasChildNodes()) {
        let eyeBox = document.createElement("div");
        eyeBox.classList.add("eyeBox");
        let leftEyeBall = document.createElement("span");
        leftEyeBall.classList.add("eyeBall");
        if (gameStatus === "") {
          leftEyeBall.classList.add("deadEyes");
        }
        let rightEyeBall = document.createElement("span");
        rightEyeBall.classList.add("eyeBall");
        if (gameStatus === "") {
          rightEyeBall.classList.add("deadEyes");
        }

        eyeBox.appendChild(leftEyeBall);
        eyeBox.appendChild(rightEyeBall);
        headElement.appendChild(eyeBox);
      }
    }
  });

  //insert image as apple to be generated randomly on the dom after being eaten
  let newAppleBox = document.getElementById(`${newApple.x},${newApple.y}`);

  newAppleBox.classList.add("redApple");
  newAppleBox.style.transform = "";
  const appleImage = document.createElement("img");
  appleImage.src =
    "https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/66/external-Apple-food-smashingstocks-flat-smashing-stocks.png";
  appleImage.style.maxWidth = "100%";
  appleImage.style.maxHeight = "100%";
  newAppleBox.appendChild(appleImage);

  if (firstStart) {
    document.querySelector("#gameover-container").style.display = "none";
  }
};

render();

//game loop

const gameLoop = () => {
  if (gameStatus === "over") {
    render();
    return;
  }

  if (gameStatus === "running") snakeMove();
  render();
  setTimeout(gameLoop, 500 * Math.pow(0.9, score));
};

gameLoop();
