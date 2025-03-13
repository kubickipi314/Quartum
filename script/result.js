export let gameResult = {
  xResult: 0,
  oResult: 0,

  updateWin(winner) {
      console.log(winner)
      if (winner == "X") {
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

function updateScore(xResult, oResult) {
  const score = document.querySelector('.score-number');
  score.textContent = `${xResult} : ${oResult}`;

  const newGame = document.querySelector('.new-game');
  newGame.style.backgroundColor = "rgb(116, 41, 145)"
}

