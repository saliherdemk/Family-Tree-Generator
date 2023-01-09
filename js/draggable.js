class Draggable {
  constructor() {
    this.dragging = false;
    this.rollover = false;

    this.x = 100;
    this.y = 100;
    this.w = 75;
    this.h = 50;
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
    }
  }

  released() {
    this.dragging = false;
  }
}
