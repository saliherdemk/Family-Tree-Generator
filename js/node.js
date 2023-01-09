class Node extends Draggable {
  constructor(id, x, y, name, spouse, children = []) {
    super(x, y);
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = name.length * 10;
    this.name = name;
    this.spouse = spouse;
    this.children = children;
  }

  setSpouse(node) {
    this.spouse = node;
  }

  setChildren(children) {
    this.children = children;
  }

  draw() {
    rect(this.x, this.y, this.w, 80);

    text(this.name, this.x, this.y);
  }
}
