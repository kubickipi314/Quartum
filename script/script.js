

const buttons = document.querySelectorAll('.field');

document.querySelector('.menu-icon').addEventListener('click', () => {
    alert('Menu Icon clicked!');
});

let gameMotive = {
    xMotive: "mini",
    oMotive: "mini"
}

let gameState = {
    currentPlayer: "X",
    currentBoard: "All",
    moveNumber: 0,
    board: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""]
    ],

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
        console.log(`${this.moveNumber} moves made`);
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
            updateGameInfo("It's DRAW!")
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
            updateGameInfo(`${this.currentPlayer} WINS!`);
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
          updateGameInfo(`${this.currentPlayer} WINS!`);
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
            updateGameInfo(`${this.currentPlayer} WINS!`);
            lightUpDiagonal("first");
            return true;
        }
        if (this.board[3][0] === this.currentPlayer
            && this.board[2][1] === this.currentPlayer
            && this.board[1][2] === this.currentPlayer
            && this.board[0][3] === this.currentPlayer
        ) {
            updateGameInfo(`${this.currentPlayer} WINS!`);
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
        updateGameInfo(`${this.currentPlayer} WINS!`);
        lightUpBoard(row, col);
        return true;
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
    if (gameState.isFieldAvl(row, col)) {
        if (gameState.isFieldFree(row, col)) {
            gameState.makeMove(row, col);
        }
    }
}

function updateButton(row, col, newContent) {
    const button = document.querySelector(`.field[data-row="${row}"][data-col="${col}"]`);
    if (button) {
      const img = document.createElement('img');
        if (newContent === "O") {
            img.src = 'motives/mini/ball.svg';
            img.className = 'sign';
            img.alt = 'ball';
        } else {
          img.src = 'motives/mini/ex.svg';
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
            console.log(index);
        }, 100 * index + 110);
    });
}
