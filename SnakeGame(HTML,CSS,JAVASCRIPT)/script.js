// Define HTML elements
const board = document.getElementById('game-board')
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const speedSelect = document.getElementById('speed');
const backgroundMusic = document.getElementById('background-music');



// Define game variables
const gridSize = 30;
let snake = [{x: 15, y: 15}]
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let startingSpeed = getStartingSpeedValue();

// Draw game map, snake and food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw Snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

//Create a snake or food cube/div
function createGameElement(tag, className)  {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//Set the position of the snake or the food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Toggle Mute for Music
function toggleMute() {
    backgroundMusic.muted = !backgroundMusic.muted;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'm' || event.key === 'M') {
        toggleMute();
    }
});

// Draw food Fumction
function drawFood() {
    if(gameStarted){
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
    }
}

function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

// Starting Speed

function getStartingSpeedValue() {
    switch (speedSelect.value) {
        case 'easy':
            return 200; 
        case 'medium':
            return 150; 
        case 'hard':
            return 100; 
        default:
            return 150; 
    }
}

function changeStartingSpeed() {
    startingSpeed = getStartingSpeedValue();
    resetGame();
}

function increaseSpeed() {
    gameSpeedDelay = startingSpeed;
}


// Making the snake move
function move() {
   const head = {...snake[0]};
   switch (direction) {
    case 'up':
        head.y--;
        break;
    case 'down':
        head.y++;
        break;
    case 'left':
        head.x--;
        break;
    case 'right':
        head.x++;
        break;
   }

   snake.unshift(head);

//    snake.pop();

   if(head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
   } else {
    snake.pop();
   }
}

// Start game function
function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}



// key press listener
function handleKeyPress(event) {
    if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
            direction = 'up';
            break;
            case 'ArrowDown':
            direction = 'down';
            break;
            case 'ArrowLeft':
            direction = 'left';
            break;
            case 'ArrowRight':
            direction = 'right';
            break;
        }    
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }

}

function checkCollision() {
    const head = snake[0];

    if( head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++){
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 15, y: 15}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block'
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if(currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

