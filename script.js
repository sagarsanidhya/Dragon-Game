let dragon = document.querySelector('.dragon');
let obstacle = document.querySelector('.obstacle');
let gameOver = document.querySelector('.gameover');
let scoreCount = document.getElementById('scorecount');
let highScoreCount = document.getElementById('highscorecount'); // Element for high score
let playAgainButton = document.getElementById('playAgain');
let themeToggleButton = document.getElementById('themeToggle'); // Dark mode toggle button
let score = 0;
let highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0; // Retrieve highest score
let isJumping = false;
let isGameOver = false;
let gameInterval;
let hasScored = false; // Flag to check if score has already been incremented

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode'); // Toggle dark-mode class on the body
    // Update the button text based on the current theme
    if (document.body.classList.contains('dark-mode')) {
        themeToggleButton.innerText = 'Switch to Light Mode';
    } else {
        themeToggleButton.innerText = 'Switch to Dark Mode';
    }
}

// Event listener for theme toggle button
themeToggleButton.addEventListener('click', toggleDarkMode);

// Initialize score display
scoreCount.innerText = 'Your score: ' + score;
highScoreCount.innerText = 'Highest score: ' + highestScore; // Display highest score

// Dragon jump on key press
document.onkeydown = function (e) {
    if (!isJumping && !isGameOver) {
        jump();
    }
};

// Function to make the dragon jump
function jump() {
    isJumping = true;
    let jumpHeight = 0;
    let maxJumpHeight = 150;
    let jumpSpeed = 5;

    // Going up
    let upInterval = setInterval(() => {
        if (jumpHeight >= maxJumpHeight) {
            clearInterval(upInterval);

            // Coming down
            let downInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    hasScored = false; // Reset scoring flag
                }
                jumpHeight -= jumpSpeed;
                dragon.style.bottom = jumpHeight + 50 + 'px';
            }, 20);
        } else {
            jumpHeight += jumpSpeed;
            dragon.style.bottom = jumpHeight + 50 + 'px';
        }
    }, 20);
}

// Function to check for collisions and scoring
function checkCollision() {
    let dragonRect = dragon.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    // Check for collision
    if (
        dragonRect.left < obstacleRect.right &&
        dragonRect.right > obstacleRect.left &&
        dragonRect.bottom > obstacleRect.top &&
        dragonRect.top < obstacleRect.bottom
    ) {
        endGame(); // End game on collision
    }

    // Check if the dragon successfully jumped over the obstacle
    if (!isGameOver && !hasScored && dragonRect.bottom <= obstacleRect.top) {
        hasScored = true; // Set flag to prevent double scoring
        score++; // Increment score
        scoreCount.innerText = 'Your score: ' + score; // Update score display
    }
}

// Start the game
function startGame() {
    score = 0; // Reset score to 0
    hasScored = false; // Reset scoring flag
    scoreCount.innerText = 'Your score: ' + score; // Display score
    highScoreCount.innerText = 'Highest score: ' + highestScore; // Display highest score
    isGameOver = false; // Reset game over status
    gameOver.style.display = 'none'; // Hide game over message
    playAgainButton.style.display = 'none'; // Hide play again button
    obstacle.classList.add('animateobstacle'); // Start obstacle animation

    gameInterval = setInterval(() => {
        if (!isGameOver) {
            checkCollision(); // Check for collisions and scoring
        }
    }, 50);
}

// End the game
function endGame() {
    isGameOver = true; // Set game over status
    gameOver.style.display = 'block'; // Show game over message
    playAgainButton.style.display = 'block'; // Show play again button
    obstacle.classList.remove('animateobstacle'); // Stop obstacle movement
    clearInterval(gameInterval); // Stop the game loop

    // Update highest score if current score is greater
    if (score > highestScore) {
        highestScore = score; // Update highest score
        localStorage.setItem('highestScore', highestScore); // Store the new highest score
    }
}

// Play again functionality
playAgainButton.onclick = function () {
    obstacle.style.right = '0'; // Reset obstacle position
    startGame(); // Restart the game
};

// Start the game on load
startGame();
