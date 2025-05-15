/*
Author: Dustin Moore
LinkedIn: https://www.linkedin.com/in/dustinmmoore
GitHub: https://github.com/dustinmmoore
Website: https://dustinmoore.dev
Date: 11/10/2024
*/

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../../service-worker.js')
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

let currentPlayer = 'X';
let partyInterval;
let fireworksCanvas, ctx;

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const partyMusic = document.getElementById('partyMusic');
    
    try {
        createTable();
        
        // Initialize audio
        partyMusic.load();
        partyMusic.volume = 0.5; // Set volume to 50%
        
        // Error handling for audio
        partyMusic.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            alert('Unable to load party music. Please check your internet connection.');
        });

        // Add canplaythrough event listener
        partyMusic.addEventListener('canplaythrough', () => {
            console.log('Audio loaded and ready to play');
        });
    } catch (error) {
        console.error('Initialization error:', error);
        document.body.innerHTML = '<p class="error-message">Sorry, there was an error loading the game. Please refresh the page.</p>';
    } finally {
        loadingScreen.classList.add('hidden');
    }
});

function createTable() {
    const tableContainer = document.getElementById('tableContainer');
    const table = document.createElement('table');
    table.id = 'ticTacToeBoard';

    for (let i = 0; i < 3; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td');
            cell.dataset.index = i * 3 + j;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Use event delegation instead of individual cell handlers
    table.addEventListener('click', handleCellClick);
    tableContainer.appendChild(table);
    adjustTableForMobile();
}

// Debounce function to prevent rapid clicks
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const handleCellClick = debounce((event) => {
    const cell = event.target;
    if (cell.tagName === 'TD' && cell.innerHTML === '') {
        makeMove(cell);
    }
}, 250);

function makeMove(cell) {
    cell.innerHTML = currentPlayer;
    cell.classList.add('cell-animated');

    if (checkWinner()) {
        setTimeout(() => {
            alert(`Player ${currentPlayer} wins!`);
            resetBoard();
        }, 100);
    } else if (isFull()) {
        setTimeout(() => {
            alert("It's a tie!");
            resetBoard();
        }, 100);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'O') {
            // Delay computer move to prevent UI blocking
            setTimeout(computerMove, 250);
        }
    }
}

function computerMove() {
    const emptyCells = Array.from(document.querySelectorAll('td')).filter(cell => cell.innerHTML === '');
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cell = emptyCells[randomIndex];
        
        requestAnimationFrame(() => {
            cell.innerHTML = 'O';
            cell.classList.add('cell-animated');
            
            if (checkWinner()) {
                setTimeout(() => {
                    alert('Player O wins!');
                    resetBoard();
                }, 100);
            } else if (isFull()) {
                setTimeout(() => {
                    alert("It's a tie!");
                    resetBoard();
                }, 100);
            } else {
                currentPlayer = 'X';
            }
        });
    }
}

function adjustTableForMobile() {
    if (window.innerWidth <= 600) {
        document.querySelectorAll('td').forEach(cell => {
            cell.style.height = '80px';
            cell.style.fontSize = '1.2em';
        });
        document.querySelectorAll('button').forEach(button => {
            button.style.width = '90%';
        });
    }
}

window.addEventListener('resize', adjustTableForMobile);

function checkWinner() {
    const board = Array.from(document.querySelectorAll('td')).map(cell => cell.innerHTML);
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function isFull() {
    return Array.from(document.querySelectorAll('td')).every(cell => cell.innerHTML !== '');
}

function resetBoard() {
    document.querySelectorAll('td').forEach(cell => cell.innerHTML = '');
    currentPlayer = 'X';
}

function togglePartyMode() {
    try {
        document.body.classList.toggle('party-mode');
        const modeToggleButton = document.getElementById('modeToggleButton');
        const partyMusic = document.getElementById('partyMusic');

        if (document.body.classList.contains('party-mode')) {
            modeToggleButton.innerText = 'Professional Mode';
            // Add user interaction promise
            const playPromise = partyMusic.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Audio playback started');
                    })
                    .catch(error => {
                        console.error('Playback error:', error);
                        alert('Unable to play music. Try clicking the button again.');
                    });
            }
            startFireworks();
        } else {
            modeToggleButton.innerText = 'Party Mode';
            partyMusic.pause();
            partyMusic.currentTime = 0;
            stopFireworks();
        }
    } catch (error) {
        console.error('Party mode error:', error);
        alert('Error toggling party mode. Please try again.');
    }
}

function startFireworks() {
    fireworksCanvas = document.getElementById('fireworks');
    const updateCanvasSize = () => {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    ctx = fireworksCanvas.getContext('2d');
    partyInterval = setInterval(() => drawBetterFirework(), 300);
}

function stopFireworks() {
    clearInterval(partyInterval);
    if (ctx) {
        ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }
}

function drawBetterFirework() {
    if (!fireworksCanvas || !ctx) return;

    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * fireworksCanvas.height;
    const numRays = 12;
    const maxRadius = Math.random() * 80 + 40;
    const colors = ['#ff00cc', '#00ffff', '#ff69b4', '#ff1493', '#00ff00', '#ffff00'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, maxRadius / 4, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < numRays; i++) {
        const angle = (i * Math.PI * 2) / numRays;
        const xEnd = x + Math.cos(angle) * maxRadius;
        const yEnd = y + Math.sin(angle) * maxRadius;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
    }
}
