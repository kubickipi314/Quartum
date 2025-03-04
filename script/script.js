

const buttons = document.querySelectorAll('.field');


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
        updateCurrentPlayer();
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
        updateButton(row, col, this.currentPlayer);
        
        this.checkEnd();

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
      if (this.moveNumber === 16) {
        console.log("end after 16 moves");
      }
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
        button.textContent = newContent;
    }
}

function updateCurrentPlayer() {
    const currentPlayer = document.querySelector(`.current-player`);
    currentPlayer.textContent = `Current Player: ${gameState.currentPlayer}`;
}

function updateCurrentBoard(currentBoard) {
  const miniBoards = document.querySelectorAll(`.mini-board`);
  miniBoards.forEach(board => board.style.border = "0px");
  if (currentBoard === "All") {
    miniBoards.forEach(board => board.style.border = "2px, rgb(116, 41, 145), solid");
  }
  else {
    const board = document.querySelector(`.mini-board[data-number="${currentBoard}"]`);
    board.style.border = "2px, rgb(116, 41, 145), solid";
  }
}
