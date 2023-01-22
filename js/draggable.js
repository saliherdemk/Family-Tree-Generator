class Draggable {
  constructor() {
    this.dragging = false;
    this.rollover = false;
    this.buttonsIsShown = false;
    this.offsetX;
    this.offsetY;
    this.globOffsetX;
    this.globOffsetY;
    this.selected = false;
  }

  setSelected(value) {
    this.selected = value;
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

  setCoordinates(x, y) {
    this.x = x;
    this.y = y;
  }

  updateSelectedCoordinates() {
    for (let i = 0; i < select.selected.length; i++) {
      const element = select.selected[i];
      if (element == this) {
        continue;
      }
      let a = element.x - this.x;
      let b = element.y - this.y;
      element.x = mouseX + a + this.offsetX;
      element.y = mouseY + b + this.offsetY;
    }
  }

  updateCoordinates() {
    if (canvasDragging) {
      this.x = mouseX + this.globOffsetX;
      this.y = mouseY + this.globOffsetY;
    }
    if (this.dragging) {
      this.updateSelectedCoordinates();
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node === this) continue;
        if (Math.abs(node.x - this.x) < 5) {
          this.x = node.x;
        }
        if (Math.abs(node.y - this.y) < 5) {
          this.y = node.y;
        }
      }
    }
  }

  specifyElement() {
    if (this.rollover) {
      selectedElementForUpdate = this;
      openPopup();
    }
  }

  nodeUpdate(name, date) {
    this.name = name;
    this.lived = date.substring(0, 9);

    let newNameBoxHeight = Math.floor(name.trim().length / 18 - 0.01) * 20;
    let newWidth = this.name.split(" ")[0].length * 10;

    this.h = 100 + newNameBoxHeight;
    this.w = Math.max(newWidth, 180);
  }

  update() {
    var btnAttrs = [
      [0, -30, "#22c55e"],
      [0, this.h + 5, "#38bdf8"],
      [this.w - 48, this.h + 5, "#f43f5e"],
      [this.w - 48, -30, "#78716c"],
    ];

    let isFilled = nodes.find(
      (node) => dist(node.x, node.y, this.x, this.y) < 20 && node !== this
    );
    if (isFilled) this.x += 200;

    this.updateCoordinates();

    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      button.position(this.x + btnAttrs[i][0], this.y + btnAttrs[i][1]);
      button.style("background-color", btnAttrs[i][2]);
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
      if (mouseButton === RIGHT && designMode) {
        this.showButtons();
      }
    }

    this.globOffsetX = this.x - mouseX;
    this.globOffsetY = this.y - mouseY;
  }

  released() {
    this.dragging = false;
  }
}
