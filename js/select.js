class Select {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.isActive = false;
    this.selected = [];
  }

  reset() {
    for (let i = 0; i < this.selected.length; i++) {
      this.selected[i].setSelected(false);
    }
    this.selected = [];
  }

  draw() {
    if (this.isActive) {
      let w = mouseX - this.x;
      let h = mouseY - this.y;

      fill(173, 216, 239, 50);
      stroke(173, 216, 230);
      strokeWeight(1);
      rect(this.x, this.y, w, h);
      this.addSelectedNodes(w, h);
      stroke(0);
      strokeWeight(2);
    }
  }

  pressed() {
    this.x = mouseX;
    this.y = mouseY;
    this.isActive = true;
  }

  released() {
    this.isActive = false;
  }

  addSelectedNodes(w, h) {
    let absX = mouseX > this.x ? this.x : mouseX;
    let absY = mouseY > this.y ? this.y : mouseY;

    w = Math.abs(w);
    h = Math.abs(h);
    for (let i = 0; i < nodes.length; i++) {
      const element = nodes[i];
      //https://editor.p5js.org/eric/sketches/HkW2DRKnl

      if (
        element.x < absX + w &&
        element.x + element.w > absX &&
        element.y < absY + h &&
        element.h + element.y > absY
      ) {
        this.selected.includes(element) ? null : this.selected.push(element);
        element.setSelected(true);
      } else {
        const index = this.selected.indexOf(element);
        if (index > -1) {
          this.selected.splice(index, 1);
        }
        element.setSelected(false);
      }
    }
  }
}
