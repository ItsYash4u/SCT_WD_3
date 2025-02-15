// Game Object
const game = {
  board: Array(9).fill(''),
  currentPlayer: 'X',
  isComputer: false,
  difficulty: 'easy',
  soundEnabled: true,
  scores: { X: 0, O: 0, ties: 0 },
  playerNames: { X: 'Player X', O: 'Player O' },
  history: [],
  winningCombos: [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]
};

// DOM Elements
const cells = document.querySelectorAll('.cell');
const gameModeBtn = document.getElementById('gameMode');
const difficultySelect = document.getElementById('difficulty');
const soundBtn = document.getElementById('sound');
const historyBtn = document.getElementById('history');
const historyPanel = document.getElementById('historyPanel');
const winModal = document.getElementById('winModal');
const winnerText = document.getElementById('winnerText');
const playAgainBtn = document.getElementById('playAgain');
const editNamesBtn = document.getElementById('editNames');
const nameInputs = document.getElementById('nameInputs');
const saveNamesBtn = document.getElementById('saveNames');

// Update Score Display
function updateScoreDisplay() {
  document.getElementById('scoreX').textContent = `${game.playerNames.X}: ${game.scores.X}`;
  document.getElementById('scoreO').textContent = `${game.playerNames.O}: ${game.scores.O}`;
  document.getElementById('scoreTies').textContent = `Ties: ${game.scores.ties}`;
}

// Handle Cell Click
function handleCellClick(index) {
  if (game.board[index] || checkWinner()) return;
  makeMove(index);
  if (game.isComputer && !checkWinner() && game.currentPlayer === 'O') {
    setTimeout(makeComputerMove, 500);
  }
}

// Make a Move
function makeMove(index) {
  game.board[index] = game.currentPlayer;
  cells[index].textContent = game.currentPlayer;
  
  const winner = checkWinner();
  if (winner) {
    handleWin(winner);
  } else if (!game.board.includes('')) {
    handleDraw();
  } else {
    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
  }
}

// Return the Winning Combination (if any)
function getWinningCombo() {
  for (const combo of game.winningCombos) {
    const [a, b, c] = combo;
    if (game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c]) {
      return combo;
    }
  }
  return null;
}

// Check for Winner and return 'X' or 'O' if found, otherwise null
function checkWinner() {
  for (const combo of game.winningCombos) {
    const [a, b, c] = combo;
    if (game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c]) {
      return game.board[a];
    }
  }
  return null;
}

// Handle a Win
function handleWin(winner) {
  game.scores[winner]++;
  updateScoreDisplay();
  
  // Add winning animation to cells
  const winningCombo = getWinningCombo();
  if (winningCombo) {
    winningCombo.forEach(index => {
      cells[index].classList.add('winner');
      cells[index].style.animationDelay = `${index * 0.1}s`;
    });
  }
  
  // Show win modal and update message
  winModal.style.display = 'flex';
  winnerText.textContent = `${game.playerNames[winner]} Wins!`;
  
  // Trigger additional effects
  triggerConfetti();
  addCelebrationStars();
  playWinSound();
}

// Handle a Draw
function handleDraw() {
  game.scores.ties++;
  updateScoreDisplay();
  winModal.style.display = 'flex';
  winnerText.textContent = "It's a Draw!";
  triggerConfetti();
  addCelebrationStars();
}

// Confetti Effect
function triggerConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
}

// Add Celebration Stars to Modal
function addCelebrationStars() {
  const modalContent = document.querySelector('.modal-content');
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('div');
    star.className = 'celebration-star';
    star.textContent = '⭐';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    modalContent.appendChild(star);
  }
}

// Play Winning Sound
function playWinSound() {
  if (game.soundEnabled) {
    const audio = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
    audio.play();
  }
}

// Computer Move Logic
function makeComputerMove() {
  const emptyCells = game.board.reduce((acc, cell, idx) =>
    !cell ? [...acc, idx] : acc, []
  );
  if (emptyCells.length === 0) return;
  let move;
  switch (game.difficulty) {
    case 'hard':
      move = getBestMove();
      break;
    case 'medium':
      move = Math.random() < 0.7 ? getBestMove() : emptyCells[Math.floor(Math.random() * emptyCells.length)];
      break;
    default:
      move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  makeMove(move);
}

// Minimax: Get the Best Move for Computer
function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < 9; i++) {
    if (!game.board[i]) {
      game.board[i] = 'O';
      const score = minimax(game.board, 0, false);
      game.board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinner();
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (!board.includes('')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
        board[i] = '';
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        board[i] = '';
      }
    }
    return bestScore;
  }
}

// Reset the Game
function resetGame() {
  game.board = Array(9).fill('');
  game.currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winner');
    cell.style.animationDelay = '';
  });
  winModal.style.display = 'none';
  document.querySelectorAll('.celebration-star').forEach(star => star.remove());
}

// Event Listeners
cells.forEach(cell => {
  cell.addEventListener('click', () => handleCellClick(parseInt(cell.dataset.index)));
});

gameModeBtn.addEventListener('click', () => {
  game.isComputer = !game.isComputer;
  gameModeBtn.textContent = game.isComputer ? 'Play vs Friend' : 'Play vs Computer';
  difficultySelect.style.display = game.isComputer ? 'block' : 'none';
  resetGame();
});

difficultySelect.addEventListener('change', (e) => {
  game.difficulty = e.target.value;
});

soundBtn.addEventListener('click', () => {
  game.soundEnabled = !game.soundEnabled;
  soundBtn.textContent = game.soundEnabled ? '🔊' : '🔈';
});

historyBtn.addEventListener('click', () => {
  historyPanel.style.display = historyPanel.style.display === 'none' ? 'block' : 'none';
});

playAgainBtn.addEventListener('click', resetGame);

editNamesBtn.addEventListener('click', () => {
  nameInputs.style.display = nameInputs.style.display === 'none' ? 'block' : 'none';
});

saveNamesBtn.addEventListener('click', () => {
  const xName = document.getElementById('playerXName').value;
  const oName = document.getElementById('playerOName').value;
  if (xName) game.playerNames.X = xName;
  if (oName) game.playerNames.O = oName;
  updateScoreDisplay();
  nameInputs.style.display = 'none';
});

// Initialize score display on load
updateScoreDisplay();
