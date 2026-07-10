 // Game Constants & Variables 
let inputDir={x:0 ,y:0}; 
let isPaused = false;
const diffBtns = document.querySelectorAll(".diffBtn");
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
let musicSound = new Audio('music/music.mp3');
musicSound.loop=true;
musicSound.addEventListener("play", () => console.log("Music started"));
musicSound.addEventListener("pause", () => console.log("Music paused"));
const musicBtn=document.getElementById("musicBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const pauseText = document.getElementById("pauseText");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const upBtn=document.getElementById("upBtn");
const downBtn=document.getElementById("downBtn");
const leftBtn=document.getElementById("leftBtn");
const rightBtn=document.getElementById("rightBtn");
let score = 0;
let selectedSpeed = 9;
let speed = selectedSpeed;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];

food = {x: 6, y: 7};

//Music player

musicBtn.addEventListener("click", () => {
    if (musicSound.paused) {
        musicSound.play();
        musicBtn.innerText = "🔊 Music On";
    } else {
        musicSound.pause();
        musicBtn.innerText = "🔈 Music Off";
    }
});

//difficulty

function setDifficultyButtons(enabled){
    diffBtns.forEach(btn=>{
        btn.disabled=!enabled;
    });
}
diffBtns.forEach(btn => {

    btn.addEventListener("click", ()=>{

        selectedSpeed = Number(btn.dataset.speed);
        speed=selectedSpeed;

        diffBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

    });

});
diffBtns[1].classList.add("active");
setDifficultyButtons(true);

//Control buttons

upBtn.addEventListener("click",()=>{
    if(inputDir.x===0 && inputDir.y===0){
        setDifficultyButtons(false);
    }
    if(inputDir.y!==1){
        inputDir={x:0,y:-1};
    }
});
downBtn.addEventListener("click",()=>{
    if(inputDir.x===0 && inputDir.y===0){
        setDifficultyButtons(false);
    }    
    if(inputDir.y!==-1){
        inputDir={x:0,y:1};
    }
});
leftBtn.addEventListener("click",()=>{
    if(inputDir.x===0 && inputDir.y===0){
        setDifficultyButtons(false);
    }    
    if(inputDir.x!==1){
        inputDir={x:-1,y:0};
    }
});
rightBtn.addEventListener("click",()=>{
    if(inputDir.x===0 && inputDir.y===0){
        setDifficultyButtons(false);
    }    
    if(inputDir.x!==-1){
        inputDir={x:1,y:0};
    }
});


// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){
        return true;
    }
        
    return false;
}

function gameEngine(){
    if (isPaused) {
        return;
    }
    if(!gameOverScreen.classList.contains("hidden")){
        return;
    }
    // Part 1: Updating the snake array & Food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        inputDir =  {x: 0, y: 0}; 
        finalScore.innerText = score;

        gameOverScreen.classList.remove("hidden"); 
        setDifficultyButtons(true);
    }

    // If you have eaten the food, increment the score and regenerate the food
    if(snakeArr[0].y === food.y && snakeArr[0].x ===food.x){
        foodSound.play();
        score += 1;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i>=0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);


}
//restart

restartBtn.addEventListener("click",()=>{
    lastPaintTime=0;
    snakeArr=[{x:13,y:15}];
    inputDir={x:0,y:0};

    score=0;
    scoreBox.innerHTML="Score: 0";

    gameOverScreen.classList.add("hidden");
    pauseText.style.display = "none";
    isPaused = false;
});

// Main logic starts here
let musicStarted = false;

let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    if (!musicStarted) {
        musicSound.play();
        musicStarted = true;
    }
    if(e.key=== "ArrowUp"||
        e.key=== "ArrowDown"||
        e.key=== "ArrowLeft"||
        e.key=== "ArrowRight"||
        e.key=== "Space"
    ){e.preventDefault();}

    if (e.code === "Space") {
        e.preventDefault();
        isPaused = !isPaused;
        if (isPaused) {
            pauseText.style.display = "block";
        } else {
            pauseText.style.display = "none";
        }
    
        return;
    }

    const arrowKeys=[
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
    ];
    if(inputDir.x===0 && inputDir.y===0 && arrowKeys.includes(e.key)){
        setDifficultyButtons(false);
    }
    // Start the game
    switch (e.key) {
        case "ArrowUp":
            if(inputDir.y !== 1){
                inputDir={x:0,y:-1};
            }
            break;

        case "ArrowDown":
            if(inputDir.y !== -1){
                inputDir={x:0,y:1};
            }
            break;

        case "ArrowLeft":
            if(inputDir.x !== 1){
                inputDir={x:-1,y:0};
            }
            break;

        case "ArrowRight":
            if(inputDir.x !== -1){
                inputDir={x:1,y:0};
            }
            break;
        default:
            break;
    }

});