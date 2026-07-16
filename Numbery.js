
// No tocar funciona despues de MUCHooooooOOOOo UEEEEEEEEEEEEEEEEEEEEEe
let difficulty = "easy";

let maxNumber = 20;





let difficultyIndex = 0;


const difficultyOrder = ["easy", "medium", "hard"];
let difficultyTimer = null;
let difficultyCountdown = null;




let difficultyTimeLeft = 5;

let selectingDifficulty = false;

let seenNumbers = new Set();

let currentNumber = 0;
let waitTimer = null;
let gameStarted = false;

let gameOver = false;

let score = 0;
let bestScore = 0;




let impostorCount = 0;

const savedBest = localStorage.getItem("numberyBest");
if (savedBest) bestScore = parseInt(savedBest, 10);


//La dificultad a vecs falla cuidado no cambiar

function applyDifficulty() {
    const diff = difficultyOrder[difficultyIndex];
    difficulty = diff;

    if (diff === "easy") maxNumber = 20;
    if (diff === "medium") maxNumber = 100;
    if (diff === "hard") maxNumber = 500;

    const box = document.getElementById("number-box");
    box.classList.remove("easy-number", "medium-number", "hard-number");
    box.classList.add(diff + "-number");

    document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("selected"));
    document.querySelector(`.diff-btn[data-diff="${diff}"]`).classList.add("selected");
}

function startDifficultyTimer() {
    if (difficultyCountdown) return;

    difficultyTimeLeft = 5;
    document.getElementById("difficulty-timer").textContent = difficultyTimeLeft;

    difficultyCountdown = setInterval(() => {
        difficultyTimeLeft--;
        document.getElementById("difficulty-timer").textContent = difficultyTimeLeft;

        if (difficultyTimeLeft <= 0) {
            clearInterval(difficultyCountdown);
            difficultyCountdown = null;
        }
    }, 1000);

    difficultyTimer = setTimeout(() => {
        clearInterval(difficultyCountdown);
        difficultyCountdown = null;
        selectingDifficulty = false;
        document.getElementById("difficulty-screen").classList.add("hidden");
        startGame();
    }, 5000);
}

function updateScoreUI() {
    document.getElementById("score").textContent = score;
}

function updateBestScoreUI() {
    document.getElementById("best-score").textContent = bestScore;
    document.getElementById("final-best-score").textContent = bestScore;
}

function updateImpostorUI() {
    document.getElementById("impostor-count").textContent = impostorCount;
}

function startGame() {
    document.getElementById("game-over").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    gameStarted = true;
    gameOver = false;
    score = 0;
    impostorCount = 0;
    seenNumbers.clear();

    updateScoreUI();
    updateImpostorUI();
    newNumber();
}

function newNumber() {
    currentNumber = Math.floor(Math.random() * maxNumber) + 1;
    const box = document.getElementById("number-box");

    box.classList.remove("slide-left", "slide-right");
    box.style.opacity = 1;
    box.style.transform = "translateX(0)";
    box.textContent = currentNumber;

    box.classList.remove("easy-number", "medium-number", "hard-number");
    box.classList.add(difficulty + "-number");

    if (waitTimer) clearTimeout(waitTimer);

    waitTimer = setTimeout(() => {
        handleReject();
    }, 2200);
}





function animateAndNext(direction) {
    const box = document.getElementById("number-box");
    box.classList.add(direction === "left" ? "slide-left" : "slide-right");

    setTimeout(() => {
        if (!gameOver) newNumber();
    }, 400);
}

function endGame() {
    gameOver = true;
    gameStarted = false;
    clearTimeout(waitTimer);

    document.getElementById("game").classList.add("hidden");
    document.getElementById("game-over").classList.remove("hidden");

    document.getElementById("final-score").textContent = score;

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("numberyBest", bestScore.toString());
    }

    updateBestScoreUI();
    document.getElementById("impostor-count-final").textContent = impostorCount;
}




function handleAccept() {
    if (gameOver) return;
    clearTimeout(waitTimer);

    if (seenNumbers.has(currentNumber)) {
        impostorCount++;
        updateImpostorUI();
        document.getElementById("message").textContent = "Impostor accepted!";
        animateAndNext("left");
        setTimeout(endGame, 400);
        return;
    }

   
    seenNumbers.add(currentNumber);
    score++;
    updateScoreUI();
    document.getElementById("message").textContent = "Number accepted!";

    animateAndNext("left");

    
    if (seenNumbers.size === maxNumber) {
        setTimeout(endGame, 400);
    }
}












function handleReject() {
    if (gameOver) return;
    clearTimeout(waitTimer);

    
    if (!seenNumbers.has(currentNumber)) {
        document.getElementById("message").textContent = "Original number rejected!";
        animateAndNext("right");
        setTimeout(endGame, 400);
        return;
    }

   

    impostorCount++;
    updateImpostorUI();
    document.getElementById("message").textContent = "Impostor rejected!";

    animateAndNext("right");

 
    if (seenNumbers.size === maxNumber) {
        setTimeout(endGame, 400);
    }
}

document.getElementById("back-difficulty").onclick = () => {
    document.getElementById("game-over").classList.add("hidden");
    document.getElementById("difficulty-screen").classList.remove("hidden");
    selectingDifficulty = true;
    startDifficultyTimer();
};






document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;

    if (!gameStarted && !gameOver && !document.getElementById("start-screen").classList.contains("hidden")) {
        document.getElementById("start-screen").classList.add("hidden");
        document.getElementById("difficulty-screen").classList.remove("hidden");
        selectingDifficulty = true;
        startDifficultyTimer();
        return;
    }

    if (selectingDifficulty) {
        difficultyIndex = (difficultyIndex + 1) % difficultyOrder.length;
        applyDifficulty();
        return;
    }

    if (gameOver) {
        document.getElementById("game-over").classList.add("hidden");
        startGame();
        return;
    }

    handleAccept();
});






applyDifficulty();
