class Node extends Draggable {
  constructor(id, x, y, name, spouses = [], children = []) {
    super(x, y);
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = 180;
    this.h = 80;
    this.name = name;
    this.lived = "????-????";
    this.spouses = spouses;
    this.children = children;
    this.parents = [];
    this.inputs = [];
    this.buttons = [];
    this.links = [];
  }

  resizeHeight(h) {
    this.h = 80 + h;
  }

  initilize(link = null, parents = []) {
    link && this.addLink(link);
    this.parents = parents;

    this.initilizeButton("Add Parent", this.parents.length, () => {
      this.addParents();
      this.hideButtons();
    });
    this.initilizeButton("Add Spouse", false, () => {
      this.addSpouse();
      this.hideButtons();
    });
    this.initilizeButton("Delete", false, () => {
      this.remove();
      this.hideButtons();
    });
    this.initilizeButton("Close", false, () => this.hideButtons());
  }

  initilizeButton(text, disabled, onPressed) {
    let button = createButton(text);
    button.position(this.x + this.w, this.y);
    if (disabled) {
      button.attribute("disabled", "");
      button.addClass("disabled");
    }
    button.addClass("node-btn");
    button.addClass(`hidden`);
    button.mousePressed(() => {
      onPressed();
    });
    this.buttons.push(button);
  }

  addLink(link) {
    !this.links.includes(link) && this.links.push(link);
  }

  setParents(parents) {
    this.parents = parents;
  }

  addParents() {
    let parent1 = new Node(
      crypto.randomUUID(),
      this.x - 200,
      this.y - 200,
      "name",
      [],
      [this]
    );

    parent1.addSpouse();
    parent1.initilize();
    parent1.links[0].linkUp.addChildren(this);
    nodes.push(parent1);

    this.buttons[0].attribute("disabled", "");
    this.buttons[0].addClass("disabled");
  }

  addSpouse(sp = null) {
    sp && this.spouses.push(sp);
    let node = new Node(
      crypto.randomUUID(),
      this.x + 200,
      this.y,
      "name",
      [this],
      []
    );
    this.spouses.push(node);

    let newLink = new Link(this, node, "marriage", this.spouses.length);
    links.push(newLink);
    let newLinkUp = new LinkUp(newLink);
    linkUps.push(newLinkUp);

    newLink.setLinkUp(newLinkUp);

    this.addLink(newLink);
    node.initilize(newLink);

    nodes.push(node);
  }

  drawText(content, x, y, w) {
    fill(0);
    textSize(18);
    textAlign(CENTER);
    textWrap(WORD);
    text(content, x, y, w);
    fill(255);
  }

  preDraw() {
    designMode && this.update();
    designMode && this.over();
  }

  draw() {
    rect(this.x, this.y, this.w, this.h);

    this.drawText(this.name, this.x, this.y + this.h / 4, this.w);
    this.drawText(this.lived, this.x, this.y + this.h - 20, this.w);
  }

  remove() {
    removeElement(nodes, this);

    [...this.buttons, ...this.inputs].forEach((el) => {
      el.remove();
    });

    for (let i = 0; i < this.links.length; i++) {
      const link = this.links[i];
      link.remove(true);
    }
  }
}
