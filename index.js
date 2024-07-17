// setting up players
function Player(name, symbol) {
    this.name = name;
    this.symbol = symbol;
}
Player.prototype.getName = function() {
    return this.name;
    // if javascript is unable to find name in the entire prototypal chain of the calling object, it will return undefined
}
Player.prototype.changeName = function(newName) {
    this.name = newName;
}
Player.prototype.getSymbol = function() {
    return this.symbol;
}
const players = [
    new Player("player1", " x  "),
    new Player("player2", " o  "),
];
let currPlayer = players[0];
// setting up game board
const dimensions = 3;
const gameboard = new Array(dimensions);
for (let i = 0; i < dimensions; i++) {
    gameboard[i] = new Array(dimensions);
    for (let j = 0; j < dimensions; j++) {
        gameboard[i][j] = null;
    }
}
// setting up game status flag (win/loss, draw, running)
let gameStatus = 0;
// game
function printBoard() {
    let str = "";
    for (let i = 0; i < dimensions; i++) {
        for (let j = 0; j < dimensions; j++) {
            str += gameboard[i][j];
            str += "\t";
        }
        str += "\n";
    }
    console.log(str);
}
function fillBoard(symbol, r, c) {
    if (r >= dimensions || c >= dimensions || r < 0 || c < 0) {
        return false;
    } else {
        gameboard[r][c] = symbol;
        return true;
    }
}
function updateIfNeeded() {
    if (checkRowWin() || checkColWin() || checkDiagonalWin()) {
        gameStatus = 1;
        return true;
    } else if (checkDrawedGame()) {
        gameStatus = 2;
        return true;
    }
    return false;
}
function playRound(r, c) {
    if (gameStatus !== 0) {
        console.log("game is over, reset to play again!");
    }
    fillBoard(currPlayer.getName(), r, c);
    const flag = updateIfNeeded();
    printBoard();
    if (gameStatus === 1) {
        console.log(`player ${currPlayer.getName()} wins!`);
    } else if (gameStatus === 2) {
        console.log("the game is drawed, its a tie!");
    } else {
        changeTurn();
        printTurn();
    }
}
function changeTurn() {
    currPlayer = currPlayer === players[0] ? players[1] : players[0];
}
function printTurn() {
    console.log(`it is player ${currPlayer.getName()}'s turn`);
}
function resetGame() {
    gameStatus = 0;
    for (let i = 0; i < dimensions; i++) {
        for (let j = 0; j < dimensions; j++) {
            gameboard[i][j] = null;
        }
    }
    currPlayer = players[0];
    console.log("Game Started");
    init();
}
function checkRowWin() {
    for (let i = 0; i < dimensions; i++) {
        let rowWin = 0;
        for (let j = 0; j < dimensions; j++) {
            if (gameboard[i][0] !== null && gameboard[i][j] === gameboard[i][0]) rowWin++;
            else break;
        }
        if (rowWin === dimensions) return true;
    }
    return false;
}
function checkColWin() {
    for (let j = 0; j < dimensions; j++) {
        let colWin = 0;
        for (let i = 0; i < dimensions; i++) {
            if (gameboard[0][j] !== null && gameboard[i][j] === gameboard[0][j]) colWin++;
            else break;
        }
        if (colWin === dimensions) return true;
    }
    return false;
}
function checkDiagonalWin() {
    return checkBDiagonalWin() || checkFDiagonalWin();
}
function checkBDiagonalWin() {
    let diagonalWin = 0;
    for (let i = 0, j = dimensions-1; i < dimensions; i++, j--) {
        if (gameboard[0][dimensions-1] !== null && gameboard[i][j] === gameboard[0][dimensions-1]) diagonalWin++;
        else break;
    }
    if (diagonalWin === dimensions) return true;
    return false;
}
function checkFDiagonalWin() {
    let diagonalWin = 0;
    for (let i = 0, j = 0; i < dimensions; i++, j++) {
        if (gameboard[0][0] !== null && gameboard[i][j] === gameboard[0][0]) diagonalWin++;
        else break;
    }
    if (diagonalWin === dimensions) return true;
    return false;
}
function checkDrawedGame() {
    // WARNING: only run this function after confirming that all win conditions have failed
    for (let i = 0; i < dimensions; i++) {
        for (let j = 0; j < dimensions; j++) {
            if (gameboard[i][j] === null) return false;
        }
    }
    return true;
}
// init
function init() {
    printBoard();
    printTurn();
}
init();

function test1() {
    playRound(0, 0);
    playRound(0, 1);
    playRound(1, 1);
    playRound(1, 2);
    playRound(2, 2);
    // result must be a win for player1
}
function test2() {
    playRound(0, 1);
    playRound(0, 0);
    playRound(0, 2);
    playRound(1, 1);
    playRound(1, 0);
    playRound(2, 2);
    // result must be a win for player2
}
function test3() {
    playRound(1, 1);
    playRound(1, 0);
    playRound(2, 2);
    playRound(0, 0);
    playRound(2, 0);
    playRound(2, 1);
    playRound(1, 2);
    playRound(0, 2);
    playRound(0, 1);
    // result must be a draw
}
function runtests() {
    console.log("------------------------------------------");
    console.log("------------------test1-------------------");
    console.log("--------win for player 1 expected---------");
    test1();
    resetGame();
    console.log("------------------------------------------");
    console.log("------------------test2-------------------");
    console.log("--------win for player 2 expected---------");
    test2();
    resetGame();
    console.log("------------------------------------------");
    console.log("------------------test3-------------------");
    console.log("--------------draw expected---------------");
    test3();
}
