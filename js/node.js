class Node extends Draggable {
  constructor(id, x, y, name, spouses = [], children = []) {
    super(x, y);
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = 180;
    this.h = 80;
    this.name = name;
    this.lived = "";
    this.spouses = spouses;
    this.children = children;
    this.parents = [];
    this.inputs = [];
    this.buttons = [];
    this.links = [];
    this.boxColor = "#ffffff";
    this.strokeColor = "#000000";
    this.textColor = "#000000";
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

  removeLink(link) {
    this.links = this.links.filter((lnk) => lnk !== link);
  }

  setParents(parents) {
    this.parents = parents;
    this.buttons[0].attribute("disabled", "");
    this.buttons[0].addClass("disabled");
  }

  setSpouses(spouses) {
    this.spouses = spouses;
  }

  setChildren(children) {
    this.children = children;
  }

  addParents() {
    let parent1 = new Node(
      crypto.randomUUID(),
      this.x - 200,
      this.y - 200,
      "Unknown",
      [],
      [this]
    );

    let parent2 = parent1.addSpouse();
    parent1.initilize();
    parent1.links[0].linkUp.addChildren(this);
    this.setParents([parent1, parent2]);
    nodes.push(parent1);
  }

  addSpouse(sp = null) {
    let node = sp
      ? sp
      : new Node(
          crypto.randomUUID(),
          this.x + 200,
          this.y,
          "Unknown",
          [this],
          []
        );
    !sp && this.spouses.push(node);

    let newLink = new Link(this, node, "marriage", this.spouses.length);
    newLink.setMidColor();
    links.push(newLink);
    let newLinkUp = new LinkUp(newLink);
    linkUps.push(newLinkUp);

    newLink.setLinkUp(newLinkUp);

    this.addLink(newLink);
    node.initilize(newLink);

    !sp && nodes.push(node);
    return node;
  }

  drawText(content, x, y, w) {
    fill(color(this.textColor));
    textSize(18);
    textAlign(CENTER);
    textWrap(WORD);
    text(content, x, y, w);
    fill(255);
  }

  preDraw() {
    this.update();
    this.over();
  }

  draw() {
    let strokeClr =
      this.rollover || this.selected ? color(173, 216, 230) : color(0);
    stroke(strokeClr);
    fill(color(this.boxColor));
    rect(this.x, this.y, this.w, this.h);
    noFill();
    noStroke();
    this.drawText(this.name, this.x, this.y + this.h / 4, this.w);
    this.drawText(this.lived, this.x, this.y + this.h - 20, this.w);
    stroke(0);
  }

  removeSpouse(spouse) {
    this.spouses = this.spouses.filter((sp) => sp !== spouse);
  }

  remove() {
    [...this.buttons, ...this.inputs].forEach((el) => {
      el.remove();
    });

    for (let i = 0; i < this.links.length; i++) {
      const link = this.links[i];
      link.remove(true);
    }

    this.links
      .find((link) => link.type === "children")
      ?.source.removeChildren(this);

    console.log(this.links);

    this.spouses.forEach((spouse) => {
      spouse.removeSpouse(this);
    });

    removeElement(nodes, this);
  }
}
