

const buttons = document.querySelectorAll('.field');

document.querySelector('.menu-icon').addEventListener('click', () => {
    alert('Menu Icon clicked!');
});

document.querySelector(`.score-sign[alt="ex"]`).addEventListener('click', () => {
    changeMotive("ex");
});

document.querySelector(`.score-sign[alt="ball"]`).addEventListener('click', () => {
    changeMotive("ball");
});

document.querySelector('.new-game').addEventListener('click', () => {
    startNewGame();
});

let gameMotive = {
    xIdx: 0,
    oIdx: 0,
    xMotives: ["normal", "mini", "blured"],
    oMotives: ["normal", "mini", "blured"],

    get(sign) {
        if (sign == "X") return this.xMotives[this.xIdx];
        else return this.oMotives[this.oIdx];
    },

    newMotive(sign) {
        if (sign == "X")this.xIdx = (this.xIdx + 1)%this.xMotives.length;
        else this.oIdx = (this.oIdx + 1)%this.oMotives.length;
    },
}

let gameResult = {
    xResult: 0,
    oResult: 0,

    updateWin(winner) {
        console.log(winner)
        if (winner == "ex") {
            this.xResult += 1;
        }
        else {
            this.oResult += 1;
        }
        console.log(this.xResult + " " + this.oResult);
        updateScore(this.xResult, this.oResult);
    },

    updateDraw() {
        this.xResult++;
        this.oResult++;
        updateScore(this.xResult, this.oResult);
    }
}

let gameState = {
    gameEnded: false,
    currentPlayer: "X",
    currentBoard: "All",
    moveNumber: 0,
    board: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""]
    ],

    resetGameState() {
        this.gameEnded = false;
        if (this.currentPlayer == "X") this.currentPlayer = "O";
        else this.currentPlayer = "X";
        this.currentBoard = "All";
        this.moveNumber = 0;
        this.board = [
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""]
        ];
    },

    swapPlayer() {
        if (this.currentPlayer === "X")
            this.currentPlayer = "O";
        else this.currentPlayer = "X";
        updateGameInfo(`Current Player: ${this.currentPlayer}`);
    },

    isFieldAvl(row, col) {
      if (this.currentBoard === "All") return true;
      if (this.currentBoard === 0) return row <= 1 && col <= 1;
      else if (this.currentBoard === 1) return row <= 1 && col >= 2;
      else if (this.currentBoard === 2) return row >= 2 && col <= 1;
      else return row >=2 && col >=2;
    },

    isFieldFree(row, col) {
        return this.board[row][col] == "";
    },

    makeMove(row, col) {
        this.moveNumber += 1;
        this.board[row][col] = this.currentPlayer;
        
        if (this.checkEnd(row, col)) {
          clearBoards();
          updateButton(row, col, this.currentPlayer);
          return;
        }

        updateButton(row, col, this.currentPlayer);
        this.swapPlayer();
        this.setCurrentBoard(row, col);
    },

    setCurrentBoard(row, col) {
        if (row%2 === 0) {
            if (col%2 === 0) this.currentBoard = 0;
            else this.currentBoard = 1;
        }
        else {
            if (col%2 === 0) this.currentBoard = 2;
            else this.currentBoard = 3;
        }
        if (!this.currentBoardAvl()) {
            this.currentBoard = "All";
        }
        updateCurrentBoard(this.currentBoard);
    },

    currentBoardAvl() {
        if (this.currentBoard === 0)
          if (this.board[0][0] === "" || this.board[0][1] === "" || this.board[1][0] === "" || this.board[1][1] === "") return true;
        if (this.currentBoard === 1)
          if (this.board[0][2] === "" || this.board[0][3] === "" || this.board[1][2] === "" || this.board[1][3] === "") return true;
        if (this.currentBoard === 2)
          if (this.board[2][0] === "" || this.board[2][1] === "" || this.board[3][0] === "" || this.board[3][1] === "") return true;
        if (this.currentBoard === 3)
          if (this.board[2][2] === "" || this.board[2][3] === "" || this.board[3][2] === "" || this.board[3][3] === "") return true;
    },

    checkEnd(row, col) {
        if (this.checkRow(row)) return true;
        if (this.checkColumn(col)) return true;
        if (this.checkDiagonal()) return true;
        if (this.checkMiniBoard(row, col)) return true;
        if (this.moveNumber === 16) {
            updateGameInfo("It's DRAW!");
            this.gameEnded = true;
            gameResult.updateDraw();
            return true;
        }
        return false
    },

    checkRow(row) {
        if (this.board[row][0] === this.currentPlayer
            && this.board[row][1] === this.currentPlayer
            && this.board[row][2] === this.currentPlayer
            && this.board[row][3] === this.currentPlayer
        ) {
            this.endWinning();
            lightUpRow(row);
            return true;
        }
        else return false;
    },

    checkColumn(col) {
      if (this.board[0][col] === this.currentPlayer
          && this.board[1][col] === this.currentPlayer
          && this.board[2][col] === this.currentPlayer
          && this.board[3][col] === this.currentPlayer
      ) {
          this.endWinning();
          lightUpColumn(col);
          return true;
      }
      else return false;
    },

    checkDiagonal() {
        if (this.board[0][0] === this.currentPlayer
            && this.board[1][1] === this.currentPlayer
            && this.board[2][2] === this.currentPlayer
            && this.board[3][3] === this.currentPlayer
        ) {
            this.endWinning();
            lightUpDiagonal("first");
            return true;
        }
        if (this.board[3][0] === this.currentPlayer
            && this.board[2][1] === this.currentPlayer
            && this.board[1][2] === this.currentPlayer
            && this.board[0][3] === this.currentPlayer
        ) {
            this.endWinning();
            lightUpDiagonal("second");
            return true;
        }
        return false;
    },

    checkMiniBoard(row, col) {
        let rowOffset = 0;
        let colOffset = 0;
        if (col >= 2) {
            colOffset = 2;
        }
        if (row >= 2) {
            rowOffset = 2
        }
        for (let i=0; i<2; ++i) {
            for (let j=0; j<2; ++j) {
                if (this.board[i+rowOffset][j+colOffset] != this.currentPlayer) return false;
            }
        }
        this.endWinning()
        lightUpBoard(row, col);
        return true;
    },

    endWinning() {
        updateGameInfo(`${this.currentPlayer} WINS!`);
        this.gameEnded = true;
        gameResult.updateWin(this.currentPlayer);
    }
}


function handleGridClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    tryMakeMove(row, col);
}

buttons.forEach(button => {
    button.addEventListener('click', handleGridClick);
});

function tryMakeMove(row, col) {
    if (!gameState.gameEnded){
        if (gameState.isFieldAvl(row, col)) {
            if (gameState.isFieldFree(row, col)) {
                gameState.makeMove(row, col);
            }
        }
    }
}

function updateButton(row, col, newContent) {
    const button = document.querySelector(`.field[data-row="${row}"][data-col="${col}"]`);
    if (button) {
      const img = document.createElement('img');
        if (newContent === "O") {
            img.src = `motives/${gameMotive.get("ball")}/ball.svg`;
            img.className = 'sign';
            img.alt = 'ball';
        } else {
          img.src = `motives/${gameMotive.get("ex")}/ex.svg`;
          img.className = 'sign';
          img.alt = 'ex';
        }
        button.appendChild(img);
        setTimeout(() => {
            
        }, 100);
    }
}

function updateGameInfo(information) {
    const gameInfo = document.querySelector(`.game-info`);
    gameInfo.textContent = information;
}

function updateCurrentBoard(currentBoard) {
  clearBoards();
  if (currentBoard === "All") {
    const miniBoards = document.querySelectorAll(`.mini-board`);
    miniBoards.forEach(board => board.style.border = "3px solid rgb(116, 41, 145)");
  }
  else {
    const board = document.querySelector(`.mini-board[data-number="${currentBoard}"]`);
    board.style.border = "3px solid rgb(116, 41, 145)";
  }
}

function clearBoards() {
    const miniBoards = document.querySelectorAll(`.mini-board`);
    miniBoards.forEach(board => board.style.border = "0px");
}

function lightUpRow(row) {
    const fields = document.querySelectorAll(`.field[data-row="${row}"]`);
    applyLightUp(fields);
}

function lightUpColumn(col) {
  const fields = document.querySelectorAll(`.field[data-col="${col}"]`);
  applyLightUp(fields);
}

function lightUpDiagonal(type) {
    let fields = [];
    for (let i=0; i<4; ++i) {
      fields.push(document.querySelector(`.field[data-row="${i}"][data-col="${type == "first" ? i : 3-i}"]`));
    }
    applyLightUp(fields);
}

function lightUpBoard(row, col) {
    let rowOffset = 0;
    let colOffset = 0;
    if (col >= 2) {
        colOffset = 2;
    }
    if (row >= 2) {
        rowOffset = 2
    }
    let fields = [];
    for (let i=0; i<2; ++i) {
        for (let j=0; j<2; ++j) {
            fields.push(document.querySelector(`.field[data-row="${i + rowOffset}"][data-col="${j + colOffset}"]`));
        }
    }
    applyLightUp(fields);
}


function applyLightUp(fields) {
    fields.forEach((field, index) => {
        setTimeout(() => {
            field.style.backgroundColor = "rgb(29, 29, 29)";
            field.style.border = "3px solid rgb(116, 41, 145)";
        }, 100 * index + 110);
    });
}

function updateScore(xResult, yResult) {
    const score = document.querySelector('.score-number');
    score.textContent = `${xResult} : ${yResult}`;

    const newGame = document.querySelector('.new-game');
    newGame.style.backgroundColor = "rgb(116, 41, 145)"
}

function startNewGame() {
    if (gameState.gameEnded) {
        gameState.resetGameState();
        const fields = document.querySelectorAll(`.field`);
        fields.forEach((field, index) => {
            setTimeout(() => {
                field.textContent = "";
                field.style.backgroundColor = "rgb(47, 47, 47)";
                field.style.border = "3px solid rgb(22, 22, 22)";
            }, 100 * index + 110);
        });

        const boards = document.querySelectorAll(`.mini-board`);
        boards.forEach((board, index) => {
            setTimeout(() => {
                board.style.border = "3px solid rgb(116, 41, 145)";
            }, 400 * index + 110);
        });

        updateGameInfo(`Current Player: ${gameState.currentPlayer}`);
        const newGame = document.querySelector('.new-game');
        newGame.style.backgroundColor = "rgb(35, 35, 35)"
    }
}

function changeMotive(sign) {
    gameMotive.newMotive(sign);
    const imgs = document.querySelectorAll(`img.sign[alt="${sign}"]`);
    imgs.forEach((img, index) => {
        setTimeout(() => {
            console.log(gameMotive.get(sign));
            img.src = `motives/${gameMotive.get(sign)}/${sign}.svg`;
        }, 100 * index);
    });

    const img = document.querySelector(`img.score-sign[alt="${sign}"]`);
    img.src = `motives/${gameMotive.get(sign)}/${sign}.svg`;
}
