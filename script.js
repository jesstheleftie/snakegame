//Global Variables
const boardSize = 15
let snake = [{x: 3, y: 4},{x: 2, y: 4},{x: 1, y: 4}]
let apple = { x: Math.floor(Math.random()*boardSize), y:Math.floor(Math.random()*boardSize)}
let firstApple = [{x:11, y:4}]
let direction = {x:1,y:0}
let gameStatus = 'running'
let score = 0


// Game Functions

const snakeMove = ()=>{
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y}

    if(head.x<0 || head.x>=boardSize || head.y<0 || head.y>=boardSize) {
        gameStatus ='over'
        return
    }
    for (let i=0; i<snake.length; i++){
        if(snake[i].x === head.x && snake[i].y === head.y){
            gameStatus = 'over'
            return
        }
    }
    snake.unshift(head)
    if (head.x === apple.x && head.y === apple.y){
        apple = randomApple()
        score += 1 
    } else {
        snake.pop()
    }
}