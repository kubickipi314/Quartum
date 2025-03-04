

const buttons = document.querySelectorAll('.field');


let gameState = {
    currentPlayer: "X",
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
    },
    isFieldFree(row, col) {
        return this.board[row][col] == "";
    },
    makeMove(row, col) {
        this.board[row][col] = this.currentPlayer;
        updateButton(row, col, this.currentPlayer);
        this.swapPlayer();
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
    console.log(`Clicked: Row ${row}, Col ${col}`);
    console.log(`Player ${gameState.currentPlayer} move`);

    if (gameState.isFieldFree(row, col)) {
      console.log("freee");
      gameState.makeMove(row, col);
    }
}

function updateButton(row, col, newContent) {
  const button = document.querySelector(`.field[data-row="${row}"][data-col="${col}"]`);
  if (button) {
      button.textContent = newContent;
  } else {
      console.log(`Button at ${row}, ${col} not found`);
  }
}
