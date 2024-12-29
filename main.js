const gameBoard = document.getElementById('gameBoard');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const playAIButton = document.getElementById('playAIButton');
const winningMessage = document.getElementById('winningMessage');

let currentPlayer = 'X';
let gameActive = false;
let gameMode = ''; // 'TWO_PLAYER' or 'AI'
let boardState = Array(9).fill('');

// Create the game cells
function createBoard() {
    gameBoard.innerHTML = '';
    boardState.fill('');
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    }
}

// Handle cell clicks
function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (boardState[index] || !gameActive) return;

    boardState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWinner()) {
        statusDisplay.textContent = `${currentPlayer} Wins!`;
        winningMessage.style.display = 'block';
        gameActive = false;
        return;
    }

    if (boardState.every(cell => cell)) {
        statusDisplay.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'AI' && currentPlayer === 'O') {
        handleAIMove();
    } else {
        statusDisplay.textContent = `${currentPlayer}'s turn`;
    }
}

// AI move handling
function handleAIMove() {
    setTimeout(() => {
        const emptyIndices = boardState.map((cell, index) => (cell ? null : index)).filter(index => index !== null);
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        boardState[randomIndex] = currentPlayer;
        document.querySelector(`.cell[data-index="${randomIndex}"]`).textContent = currentPlayer;

        if (checkWinner()) {
            statusDisplay.textContent = `${currentPlayer} Wins!`;
            winningMessage.style.display = 'block';
            gameActive = false;
            return;
        }

        currentPlayer = 'X';
        statusDisplay.textContent = `${currentPlayer}'s turn`;
    }, 500);
}

// Check winner logic
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombinations.some(combination =>
        combination.every(index => boardState[index] === currentPlayer)
    );
}

// Start game based on mode
function startGame(mode) {
    gameMode = mode;
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.textContent = `${currentPlayer}'s turn (${mode === 'AI' ? 'vs AI' : 'Two Player'})`;
    createBoard();
    gameBoard.style.visibility = 'visible';
    document.querySelector('.controls').style.display = 'block';
    winningMessage.style.display = 'none';
}

// Restart game functionality
restartButton.addEventListener('click', () => startGame(gameMode));

// Event listeners for Mode Buttons
twoPlayerBtn.addEventListener('click', () => startGame('TWO_PLAYER'));
playAIButton.addEventListener('click', () => startGame('AI'));