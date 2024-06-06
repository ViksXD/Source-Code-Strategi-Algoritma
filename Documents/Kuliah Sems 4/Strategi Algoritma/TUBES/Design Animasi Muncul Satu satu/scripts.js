let animationQueue = [];
let animationSpeed = 100; // 1ms delay between each number appearing

function initializeBoard(size) {
    const board = [];
    for (let i = 0; i < size; i++) {
        board.push(new Array(size).fill('-'));
    }
    return board;
}

function isSafe(board, row, col, char) {
    const size = board.length;
    const subgridSize = Math.floor(Math.sqrt(size));

    // Check row
    if (board[row].includes(char)) {
        return false;
    }

    // Check column
    for (let i = 0; i < size; i++) {
        if (board[i][col] === char) {
            return false;
        }
    }

    // Check subgrid
    const startRow = subgridSize * Math.floor(row / subgridSize);
    const startCol = subgridSize * Math.floor(col / subgridSize);
    for (let i = startRow; i < startRow + subgridSize; i++) {
        for (let j = startCol; j < startCol + subgridSize; j++) {
            if (i < size && j < size && board[i][j] === char) {
                return false;
            }
        }
    }

    return true;
}

function solveSudokuBacktracking(board, chars) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        return true;
    }

    const [row, col] = emptyCell;
    for (let char of chars) {
        if (isSafe(board, row, col, char)) {
            board[row][col] = char;
            queueAnimation(row, col, char);
            if (solveSudokuBacktracking(board, chars)) {
                return true;
            }
            board[row][col] = '-';
            queueAnimation(row, col, '-');
        }
    }

    return false;
}

function solveSudokuGreedy(board, chars) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            if (board[row][col] === '-') {
                for (let char of chars) {
                    if (isSafe(board, row, col, char)) {
                        board[row][col] = char;
                        queueAnimation(row, col, char);
                        if (solveSudokuGreedy(board, chars)) {
                            return true;
                        }
                        board[row][col] = '-';
                        queueAnimation(row, col, '-');
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function findEmptyCell(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === '-') {
                return [i, j];
            }
        }
    }
    return null;
}

function queueAnimation(row, col, value) {
    animationQueue.push({ row, col, value });
}

function runAnimations(startTime) {
    if (animationQueue.length > 0) {
        const { row, col, value } = animationQueue.shift();
        updateCell(row, col, value);
        setTimeout(() => runAnimations(startTime), animationSpeed);
    } else {
        const endTime = performance.now();
        const runningTime = ((endTime - startTime) + (animationQueue.length * animationSpeed)) / 1000;
        alert(`Sudoku solved in ${runningTime.toFixed(6)} seconds.`);
    }
}

function updateCell(row, col, value) {
    const cellId = `cell-${row}-${col}`;
    const cell = document.getElementById(cellId);
    cell.textContent = value;
    if (value !== '-') {
        cell.classList.add('animate');
        setTimeout(() => {
            cell.classList.remove('animate');
        }, animationSpeed);
    }
}

function createGrid(size) {
    const sudokuGrid = document.getElementById('sudokuGrid');
    sudokuGrid.classList.remove('hidden');
    sudokuGrid.innerHTML = '';
    sudokuGrid.style.gridTemplateColumns = `repeat(${size}, 40px)`;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('sudoku-cell');
            cellDiv.id = `cell-${row}-${col}`;
            cellDiv.textContent = '-';
            sudokuGrid.appendChild(cellDiv);
        }
    }
}

function solveSudoku() {
    const size = parseInt(document.getElementById('sizeSelect').value);
    const algorithm = document.getElementById('algorithmSelect').value;
    const board = initializeBoard(size);
    const chars = 'abcdefghijklmnopqrstuvwxyz'.slice(0, size);

    createGrid(size);
    animationQueue = [];

    const startTime = performance.now();
    let solved;

    if (algorithm === 'backtracking') {
        solved = solveSudokuBacktracking(board, chars);
    } else if (algorithm === 'greedy') {
        solved = solveSudokuGreedy(board, chars);
    }

    if (solved) {
        runAnimations(startTime);
    } else {
        alert("No solution found.");
    }
}
