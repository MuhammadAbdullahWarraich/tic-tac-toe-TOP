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
    new Player("player1", "x"),
    new Player("player2", "o"),
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
function playRound() {

}
function resetGame() {

}
