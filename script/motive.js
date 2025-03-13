
export function setupMotiveEvents() {
    document.querySelector(`.score-sign[alt="X"]`).addEventListener('click', () => {
      changeMotive("X");
    });

    document.querySelector(`.score-sign[alt="O"]`).addEventListener('click', () => {
      changeMotive("O");
    });
}

export let gameMotive = {
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