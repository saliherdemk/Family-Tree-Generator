class Draggable {
  constructor() {
    this.dragging = false;
    this.rollover = false;
    this.buttonsIsShown = false;
    this.x = 100;
    this.y = 100;
    this.w = 75;
    this.h = 80;
  }

  over() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
      if (this.spouse) {
        this.spouse.x =
          this.x > this.spouse.x
            ? this.x - 100 - this.spouse.w
            : this.x + this.w + 100;
        this.spouse.y = this.y;
      }
    }
    var btnPositions = [
      [0, -30, "#22c55e"],
      [0, this.h + 5, "#38bdf8"],
      [this.w - 48, this.h + 5, "#f43f5e"],
      [this.w - 48, -30, "#78716c"],
    ];

    var positions = [
      [12, 10, "transparent"],
      [12, this.h - 25, "transparent"],
    ];

    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      button.position(this.x + btnPositions[i][0], this.y + btnPositions[i][1]);
      button.style("background-color", btnPositions[i][2]);
    }

    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      let y = i === 0 ? positions[i][1] : this.h - 5 - input.elt.clientHeight;
      input.position(this.x + positions[i][0], this.y + y);
      input.style("background-color", positions[i][2]);
    }
  }

  showButtons() {
    this.buttons.forEach((btn) => {
      btn.removeClass("hidden");
    });
  }

  hideButtons() {
    this.buttons.forEach((btn) => {
      btn.addClass("hidden");
    });
  }

  updateNode() {
    if (this.rollover) {
      console.log(this.name);
    }
  }

  pressed() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
      if (mouseButton === RIGHT) {
        this.showButtons();
      }
    }
  }

  released() {
    this.dragging = false;
  }
}
