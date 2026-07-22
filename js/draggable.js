class Draggable {
  constructor() {
    this.dragging = false;
    this.rollover = false;
    this.buttonsIsShown = false;
    this.offsetX;
    this.offsetY;
    this.selected = false;
  }

  setSelected(value) {
    this.selected = value;
  }

  over() {
    let world = screenToWorld(mouseX, mouseY);
    if (
      world.x > this.x &&
      world.x < this.x + this.w &&
      world.y > this.y &&
      world.y < this.y + this.h
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
    let world = screenToWorld(mouseX, mouseY);
    for (let i = 0; i < select.selected.length; i++) {
      const element = select.selected[i];
      if (element == this) {
        continue;
      }
      let a = element.x - this.x;
      let b = element.y - this.y;
      element.x = world.x + a + this.offsetX;
      element.y = world.y + b + this.offsetY;
    }
  }

  updateCoordinates() {
    if (this.dragging) {
      let world = screenToWorld(mouseX, mouseY);
      select.selected.includes(this)
        ? this.updateSelectedCoordinates()
        : select.reset();
      this.x = world.x + this.offsetX;
      this.y = world.y + this.offsetY;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node === this) continue;
        if (Math.abs(node.x - this.x) < 5 && !this.selected) {
          this.x = node.x;
        }
        if (Math.abs(node.y - this.y) < 5 && !this.selected) {
          this.y = node.y;
        }
      }
    }
  }

  specifyElement() {
    if (this.rollover && designMode) {
      selectedElementForUpdate = this;
      openPopup();
    }
  }

  nodeUpdate(name, date, boxColor, strokeColor, textColor) {
    this.name = name;
    this.lived = date.substring(0, 9);
    this.boxColor = boxColor;
    this.strokeColor = strokeColor;
    this.textColor = textColor;

    let newNameBoxHeight = Math.floor(name.trim().length / 18 - 0.01) * 20;
    let newWidth = this.name.split(" ")[0].length * 10;

    this.h = 100 + newNameBoxHeight;
    this.w = Math.max(newWidth, 180);

    this.links.find((lnk) => lnk.type === "marriage")?.setMidColor();
  }

  update() {
    let isFilled = nodes.find(
      (node) => dist(node.x, node.y, this.x, this.y) < 20 && node !== this
    );
    if (isFilled) this.x += 200;

    this.updateCoordinates();

    let nodeScreenPos = worldToScreen(this.x, this.y);
    let sw = this.w * zoomLevel;
    let sh = this.h * zoomLevel;
    var btnAttrs = [
      [0, -30, "#22c55e"],
      [0, sh + 5, "#38bdf8"],
      [sw - 48, sh + 5, "#f43f5e"],
      [sw - 48, -30, "#78716c"],
    ];
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      button.position(nodeScreenPos.x + btnAttrs[i][0], nodeScreenPos.y + btnAttrs[i][1]);
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
    let world = screenToWorld(mouseX, mouseY);
    if (
      world.x > this.x &&
      world.x < this.x + this.w &&
      world.y > this.y &&
      world.y < this.y + this.h
    ) {
      this.dragging = true;
      this.offsetX = this.x - world.x;
      this.offsetY = this.y - world.y;
      if (mouseButton === RIGHT && designMode) {
        this.showButtons();
      }
      select.released();
    }
  }

  released() {
    this.dragging = false;
  }
}
