document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart');
    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const checkWin = (board, player) => {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return board[index] === player;
            });
        });
    };

    const checkDraw = (board) => {
        return board.every(cell => {
            return cell === 'X' || cell === 'O';
        });
    };

    const minimax = (newBoard, player) => {
        const availSpots = newBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);

        if (checkWin(newBoard, 'X')) {
            return { score: -10 };
        } else if (checkWin(newBoard, 'O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    };

    const computerMove = () => {
        const bestSpot = minimax(board, 'O').index;
        board[bestSpot] = 'O';
        cells[bestSpot].textContent = 'O';
        setTimeout(() => {
            clickSound.currentTime = 0;
            clickSound.play();
        }, 200);
        if (checkWin(board, 'O')) {
            setTimeout(() => {
                message.textContent = 'Computer wins!';
                loseSound.currentTime = 0;
                loseSound.play();
            }, 300);
        } else if (checkDraw(board)) {
            message.textContent = 'It\'s a draw!';
        } else {
            currentPlayer = 'X';
        }
    };

    const handleClick = (event) => {
        const index = event.target.getAttribute('data-index');
        if (board[index] === '' && currentPlayer === 'X') {
            board[index] = 'X';
            event.target.textContent = 'X';
            setTimeout(() => {
                clickSound.currentTime = 0;
                clickSound.play();
            }, 200);
            if (checkWin(board, 'X')) {
                setTimeout(() => {
                    message.textContent = 'You win!';
                    winSound.currentTime = 0;
                    winSound.play();
                }, 300);
            } else if (checkDraw(board)) {
                message.textContent = 'It\'s a draw!';
            } else {
                currentPlayer = 'O';
                setTimeout(computerMove, 500);
            }
        }
    };

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        cells.forEach(cell => cell.textContent = '');
        message.textContent = '';
    };

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    restartButton.addEventListener('click', resetGame);
});
