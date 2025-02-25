const ticTacToe = (function() {
    const gameboard = (function() {
        // ----------nested functions
        function CellFactory() {
            let value = null;
            const getValue = () => value;
            const setValue = function(toBeSet) {
                value = toBeSet;
            }
            return {
                getValue,
                setValue
            };
        }
        // ----------state
        const dimensions = 3;
        const board = new Array(dimensions);
        for (let i = 0; i < dimensions; i++) {
            board[i] = new Array();
            for (let j = 0; j < dimensions; j++) {
                board[i].push(CellFactory());
            }
        }
        // ----------methods
        function getDimensions() {
            return dimensions;
        }
        function getValue(r, c) {
            return board[r][c].getValue();
        }
        function isFilled() {
            for (let i = 0; i < dimensions; i++) {
                for (let j = 0; j < dimensions; j++) {
                    if (board[i][j].getValue() === null) {
                        return false;
                    }
                }
            }
            return true;
        }
        function isEmpty() {
            return !isFilled();
        }
        function fillValue(value, r, c) {
            if (r >= dimensions || c >= dimensions || r < 0 || c < 0) return false;
            if (board[r][c].getValue() !== null) return false; 
            board[r][c].setValue(value);
            return true;
        }
        function printBoard() {
            let str = "";
            for (let i = 0; i < dimensions; i++) {
                for (let j = 0; j < dimensions; j++) {
                    str += board[i][j].getValue();
                    str += "\t";
                }
                str += "\r\n";
            }
            console.log(str);
        }
        function reset() {
            for (let i = 0; i < dimensions; i++) {
                for (let j = 0; j < dimensions; j++) {
                    board[i][j].setValue(null);
                }
            }
        }
        return {
            getDimensions,
            getValue,
            isFilled,
            isEmpty,
            fillValue,
            printBoard,
            reset
        }
    })();
    function PlayerFactory(name, symbol) {
        const getName = () => name;
        const changeName = function(newName) {
            name = newName;
        }
        const getSymbol = () => symbol;
        return {
            getName,
            changeName, 
            getSymbol
        };
    }
    const gamecontroller = (function() {
        //----------state
        let gameStatus = 0;
        const dimensions = gameboard.getDimensions();
        const players = [
            PlayerFactory("player1", " x  "),
            PlayerFactory("player2", " o  ")
        ];
        let currPlayer = players[0];
        //----------init
        function init() {
            console.log("----------THE GAME HAS STARTED!!----------");
            printRound();
        }
        init();
        //----------public methods
        function playRound(r, c) {
            if (gameStatus !== 0) {
                console.log("game over! Reset to play again");
                return false;
            }
            let flag = false;
            flag = gameboard.fillValue(currPlayer.getSymbol(), r, c);
            if (true === flag) {
                renderer.renderConsoleBasedTurn(r, c);
                flag = updateGameStatus();
            } else {
                console.log("Invalid input, try again");
            }
            if (false === flag) {
                changeTurn();
                printRound();
            }
            return true;
        }
        function resetGame() {
            console.log("resetting game...")
            gameboard.reset();
            renderer.resetDisplay();
            gameStatus = 0;
            currPlayer = players[0];
            init();
        }
        function changeName(index, newName) {
            if (index !== 0 && index !== 1) {
                return false;
            }
            players[index].changeName(newName);
            return true;
        }
        function getCurrPlayer() {
            return currPlayer;
        }
        function getDimensions() {
            return dimensions;
        }
        function getGameStatus() {
            return gameStatus;
        }
        //----------return statement for GameControllerFactory_onetime()
        return {
            playRound,
            resetGame,
            changeName,
            getCurrPlayer,
            getDimensions,
            getGameStatus
        };
        //----------private methods
        function changeTurn() {
            currPlayer = currPlayer === players[0] ? players[1] : players[0];
        }
        function printRound() {
            gameboard.printBoard();
            console.log(`it is ${currPlayer.getName()}'s turn`);
        }
        function updateGameStatus() {
            if (checkRowWin() === true || checkColWin() === true || checkDiagonalWin() === true) {
                gameStatus = 1;
                gameboard.printBoard();
                console.log(`Player ${currPlayer.getName()} wins!`);
                return true;
            }
            if (gameboard.isFilled() === true) {
                gameStatus = 2;
                gameboard.printBoard();
                console.log("It's a tie!");
                return true;
            }
            return false;
        }
        function checkRowWin() {
            for (let i = 0; i < dimensions; i++) {
                const compareWithMe = gameboard.getValue(i, 0);
                if (compareWithMe === null) continue;
                let rowWin = 0;
                for (let j = 0; j < dimensions; j++) {
                    const val = gameboard.getValue(i, j);
                    if (val === compareWithMe) {
                        rowWin++;
                    }
                }
                if (rowWin === dimensions) {
                    return true;
                }
            }
            return false;
        }
        function checkColWin() {
            for (let j = 0; j < dimensions; j++) {
                const compareWithMe = gameboard.getValue(0, j);
                if (compareWithMe === null) continue;
                let colWin = 0;
                for (let i = 0; i < dimensions; i++) {
                    const val = gameboard.getValue(i, j);
                    if (val === compareWithMe) {
                        colWin++;
                    }
                }
                if (colWin === dimensions) {
                    return true;
                }
            }
            return false;
        }
        function checkDiagonalWin() {
            let flag = checkFDiagonalWin();
            if (flag === false) {
                flag = checkBDiagonalWin();
            }
            return flag;
        }
        function checkFDiagonalWin() {
            let diagonalWin = 0;
            const compareWithMe = gameboard.getValue(0, 0);
            if (compareWithMe === null) {
                return false;
            }
            for (let i = 0, j = 0; i < dimensions; i++, j++) {
                const val = gameboard.getValue(i, j);
                if (compareWithMe === val) {
                    diagonalWin++;
                } else {
                    break;
                }
            }
            if (diagonalWin === dimensions) return true;
            return false;
        }
        function checkBDiagonalWin() {
            let diagonalWin = 0;
            const compareWithMe = gameboard.getValue(0, dimensions-1);
            if (compareWithMe === null) {
                return false;
            }
            for (let i = 0, j = dimensions-1; i < dimensions; i++, j--) {
                const val = gameboard.getValue(i, j);
                if (compareWithMe === val) {
                    diagonalWin++;
                } else {
                    break;
                }
            }
            if (diagonalWin === dimensions) return true;
            return false;
        }
    })();
    // tests
    function test1() {
        gamecontroller.playRound(0, 0);
        gamecontroller.playRound(0, 1);
        gamecontroller.playRound(1, 1);
        gamecontroller.playRound(1, 2);
        gamecontroller.playRound(2, 2);
        // result must be a win for player1
    }
    function test2() {
        gamecontroller.playRound(0, 1);
        gamecontroller.playRound(0, 0);
        gamecontroller.playRound(0, 2);
        gamecontroller.playRound(1, 1);
        gamecontroller.playRound(1, 0);
        gamecontroller.playRound(2, 2);
        // result must be a win for player2
    }
    function test3() {
        gamecontroller.playRound(1, 1);
        gamecontroller.playRound(1, 0);
        gamecontroller.playRound(2, 2);
        gamecontroller.playRound(0, 0);
        gamecontroller.playRound(2, 0);
        gamecontroller.playRound(2, 1);
        gamecontroller.playRound(1, 2);
        gamecontroller.playRound(0, 2);
        gamecontroller.playRound(0, 1);
        // result must be a draw
    }
    function runtests() {
        console.log("------------------------------------------");
        console.log("------------------test1-------------------");
        console.log("--------win for player 1 expected---------");
        test1();
        gamecontroller.resetGame();
        console.log("------------------------------------------");
        console.log("------------------test2-------------------");
        console.log("--------win for player 2 expected---------");
        test2();
        gamecontroller.resetGame();
        console.log("------------------------------------------");
        console.log("------------------test3-------------------");
        console.log("--------------draw expected---------------");
        test3();
    }
    // rendering
    var renderer = (function() {
        // state
        const matchResult = document.querySelector('#match-result');
        const container = document.querySelector('#game-container');
        const nameChangeForm = document.querySelector('#change-name-form');
        const playersPanel = document.querySelector('#players-panel');
        const playersPanelDisplay = playersPanel.querySelectorAll('.curr-name');
        // init
        function init() {
            makeContainers();
            setupResetFunctionality();
            makeFormWorkable();
        }
        init();
        // return
        return {
            resetDisplay,
            renderConsoleBasedTurn,
            formSubmitNonDefaultAction
        }
        // functions
        function renderConsoleBasedTurn(r, c) {
            const idToFind = `r${r}-c${c}`;
            const item = container.querySelector(`#${idToFind}`);
            const symbol = gamecontroller.getCurrPlayer().getSymbol();
            item.innerHTML = 
                `<img src="./images/alpha-${symbol.trim()}.svg" class="game-symbol" />`;
        }
        function makeContainers() {
            const n = gamecontroller.getDimensions();
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    const item = document.createElement('div');
                    item.id = `r${i}-c${j}`;
                    item.classList.add("game-item");
                    item.addEventListener('click', e => {
                        const itemId = e.target.id;
                        const [r, c] = itemId.match(/[\d]+/g).map(el => Number(el));
                        const currPlayer = gamecontroller.getCurrPlayer();
                        const symbol = currPlayer.getSymbol();
                        const flag = gamecontroller.playRound(r, c);
                        if (flag === false) return;
                        item.innerHTML = 
                        `<img src="./images/alpha-${symbol.trim()}.svg" class="game-symbol" />`;
                        const gameStatus = gamecontroller.getGameStatus();
                        if (gameStatus === 0) return;
                        if (gameStatus === 1) {
                            matchResult.textContent = `${currPlayer.getName()} wins!`;
                        } else {
                            matchResult.textContent = 'The game is drawed, its a tie!';
                        }
                    });
                    container.appendChild(item);
                }
            }
        }
        function resetDisplay() {
            container.querySelectorAll("div").forEach(item => {
                item.innerHTML = "";
            })
            matchResult.textContent = "";
        }
        function setupResetFunctionality() {
            const resetButton = document.querySelector('#reset-game');
            resetButton.addEventListener('click', () => {
                gamecontroller.resetGame();
                resetDisplay();
            });
        }
        function makeFormWorkable() {
            makeFormOpenable();
            configureFormSubmission();
        }
        function makeFormOpenable() {
            const openNameChangeForm = document.querySelector('#open-change-name-form-button');
            const closeNameChangeForm = document.querySelector('#close-change-name-form-button');
            openNameChangeForm.addEventListener('click', () => {
                nameChangeForm.classList.add("is-open");
            });
            closeNameChangeForm.addEventListener('click', () => {
                nameChangeForm.classList.remove('is-open');
            })
        }
        function configureFormSubmission() {
            nameChangeForm.addEventListener('submit', (e) => {
                const tLen = e.target.length;
                let newName, player;
                for (let i = 0; i < tLen; i++) {
                    if (e.target[i].name === "new-name") {
                        newName = e.target[i].value;
                    } else if (e.target[i].name === "player" && e.target[i].checked === true) {
                        player = e.target[i].value;
                    }
                }
                formSubmitNonDefaultAction();
                e.preventDefault();
            });        
        }
        function formSubmitNonDefaultAction(player, newName) {
            gamecontroller.changeName(player-1, newName);
            playersPanelDisplay[player-1].innerHTML = newName;
            if (nameChangeForm.classList.contains('is-open')) {
                nameChangeForm.classList.remove('is-open');
            }
        }
    })();
    function changeName(player, newName) {
        if (player !== 2 && player !== 1) return false;
        if (typeof newName !== "string") return false;
        renderer.formSubmitNonDefaultAction(player, newName);
        return true;
    }
    return {
        playRound: gamecontroller.playRound,
        resetGame: gamecontroller.resetGame,
        changeName
    };
})();
