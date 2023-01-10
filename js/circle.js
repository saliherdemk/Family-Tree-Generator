class Circle {
  constructor(linkUp) {
    this.linkUp = linkUp;
    this.x = null;
    this.y = null;
    this.rollover = false;
    this.r = 20;
  }

  over() {
    if (sqrt(sq(this.x - mouseX) + sq(this.y - mouseY)) < this.r / 2) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update() {
    this.r = this.rollover ? 30 : 20;
    this.x = this.linkUp.x;
    this.y = this.linkUp.y;
  }

  pressed() {
    this.rollover && this.addChildren();
  }

  addChildren() {
    let parent1 = this.linkUp.sourceLink.source;
    let parent2 = this.linkUp.sourceLink.target;
    let newChild = new Node(lastId + 1, this.x, this.y + 100, "name", null, []);
    parent1.addChildren(newChild);
    parent2.addChildren(newChild);
    nodes.push(newChild);
    lastId += 1;
  }

  draw() {
    this.update();
    circle(this.x, this.y, this.r);
  }

  remove() {
    removeElement(circles, this);
  }
}
