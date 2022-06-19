const tile = document.getElementsByClassName('tile');
const resetButton = document.getElementById('reset-button');
const gameInfo = document.getElementById('game-info');
let gameActive = true;

class Game {
    constructor(depth) {
        this.tab = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        this.winningCount = 3;
        this.depth = depth;
        gameInfo.innerHTML = 'X turn';
    }

    // Checking draw
    draw = () => {

        for (let i = 0; i < this.tab.length; i++) {
            if (this.tab[i] === ' ') return false; // Return false if there's no draw
        }   
        return true;    // Otherwise return true
    }

    // Checking winner
    checkWinner = player => {
        
        const winningConditions = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6]];

        for (let i = 0; i < winningConditions.length; i++) {           
            if (this.tab[winningConditions[i][0]] === player && this.tab[winningConditions[i][1]] === player && this.tab[winningConditions[i][2]] === player) 
                return true;    // Return true if there's a winner  
        }
        return false;   // Otherwise return false
    }

    // MiniMax algorithm with alpha-beta prunings 
    minimax = (currentDepth, maxDepth, maximum, alpha, beta) => {
        
        if (this.checkWinner('O')) return this.depth - currentDepth;    // Returns if computer wins
        if (this.checkWinner('X')) return currentDepth - this.depth;    // Returns if player wins
        if (this.draw() || maxDepth <= 0) return 0;    // Draw

        // Maximize profit
        if (maximum) {
            let best = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < this.tab.length; i++) {
                if (this.tab[i] === ' ') {
                    this.tab[i] = 'O';
                    best = Math.max(best, this.minimax(currentDepth + 1, maxDepth - 1, !maximum, alpha, beta));
                    this.tab[i] = ' ';
                    // Alpha-beta pruning
                    alpha = Math.max(alpha, best);
                    if (beta <= alpha) break;
                }
            }
            return best;

        // Minimize profit
        } else {
            let best = Number.POSITIVE_INFINITY;
            for (let i = 0; i < this.tab.length; i++) {
                if (this.tab[i] === ' ') {
                    this.tab[i] = 'X';
                    best = Math.min(best, this.minimax(currentDepth + 1, maxDepth - 1, !maximum, alpha, beta));
                    this.tab[i] = ' ';
                    // Alpha-beta pruning
                    beta = Math.min(beta, best);
                    if (beta <= alpha) break;
                }
            }
            return best;

        }
    }

    aiMove = () => {

        let bestMove = Number.NEGATIVE_INFINITY, currentMove = Number.NEGATIVE_INFINITY;
        let alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY;
        let maxDepth = this.depth;
        let move ;

        // Checking every available tile and calling minimax for them 
        for (let i = 0; i < this.tab.length; i++) {
            if (this.tab[i] === ' ') {
                this.tab[i] = 'O';
                currentMove = this.minimax(1, maxDepth - 1, false, alpha, beta);
                this.tab[i] = ' ';
                if (currentMove > bestMove) {
                    bestMove = currentMove;
                    move = i;
                } 
            }
        }
        return move;
    }

    
    round = tileNumber => {

        if (this.tab[tileNumber] === ' ') {
            // X turn
            this.tab[tileNumber] = 'X';
            tile[tileNumber].innerHTML = 'X'
            // Checking winner or draw
            if (this.checkWinner('X')) {
                gameActive = false;
                gameInfo.innerHTML = 'X wins!'
                return;
            } else if (this.draw()) {
                gameActive = false;
                gameInfo.innerHTML = 'Draw!'
                return;
            }
            // O turn after 1 sec for better UX
            gameInfo.innerHTML = 'O turn'
            gameActive = false;    // Block game while waiting for AI
            setTimeout(() => {
                let aiMove = this.aiMove();
                if (!gameActive) {
                    this.tab[aiMove] = 'O';
                    tile[aiMove].innerHTML = 'O'
                    gameInfo.innerHTML = 'X turn';
                    // Checking winner or draw
                    if (this.checkWinner('O')) {
                        gameActive = false;
                        gameInfo.innerHTML = 'O wins!'
                        return;
                    } else if (this.draw()) {
                        gameActive = false;
                        gameInfo.innerHTML = 'Draw!'
                        return;
                    }
                    gameActive = true;
                }
            }, 1000);
        }
    }

    // Reset all parameters and HTML content
    resetAll = () => {

        this.tab = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        for (let i = 0; i < tile.length; i++){
            document.getElementById(`tile-${i}`).innerHTML = ' ';
        }
        gameInfo.innerHTML = 'X turn';
        gameActive = true;        
    }
}

// Creating game class
const gameClass = new Game(7);

// Event listeners
for (let i = 0; i < tile.length; i++){
    tile[i].addEventListener("click", () => {
        if (gameActive)
            gameClass.round(i);
    })
}

resetButton.addEventListener("click", () => {
    gameClass.resetAll();
})

