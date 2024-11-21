/*
Author: Dustin Moore
LinkedIn: https://www.linkedin.com/in/dustinmmoore
GitHub: https://github.com/dustinmmoore
Website: https://dustinmoore.dev
Date: 11/10/2024
*/

let currentPlayer = 'X';
let partyInterval;
let fireworksCanvas, ctx;

document.addEventListener('DOMContentLoaded', () => {
    createTable();
});

function createTable() {
    const tableContainer = document.getElementById('tableContainer');
    const table = document.createElement('table');
    table.id = 'ticTacToeBoard';

    for (let i = 0; i < 3; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td');
            cell.onclick = function() { makeMove(this); };
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    tableContainer.appendChild(table);
}

function makeMove(cell) {
    if (cell.innerHTML === '') {
        cell.innerHTML = currentPlayer;
        if (checkWinner()) {
            alert(`Player ${currentPlayer} wins!`);
            resetBoard();
        } else if (isFull()) {
            alert("It's a tie!");
            resetBoard();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                computerMove();
            }
        }
    }
}

function computerMove() {
    const emptyCells = Array.from(document.querySelectorAll('td')).filter(cell => cell.innerHTML === '');
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        emptyCells[randomIndex].innerHTML = 'O';
        if (checkWinner()) {
            alert('Player O wins!');
            resetBoard();
        } else if (isFull()) {
            alert("It's a tie!");
            resetBoard();
        } else {
            currentPlayer = 'X';
        }
    }
}

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
    document.body.classList.toggle('party-mode');
    const modeToggleButton = document.getElementById('modeToggleButton');
    const partyMusic = document.getElementById('partyMusic');

    if (document.body.classList.contains('party-mode')) {
        modeToggleButton.innerText = 'Professional Mode';
        partyMusic.play().catch(error => {
            console.log('Background music playback error:', error);
        });
        startFireworks();
    } else {
        modeToggleButton.innerText = 'Party Mode';
        partyMusic.pause();
        partyMusic.currentTime = 0;
        stopFireworks();
    }
}

function startFireworks() {
    fireworksCanvas = document.getElementById('fireworks');
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
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
