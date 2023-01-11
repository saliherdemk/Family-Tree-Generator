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

    let inputHeight = 21;

    this.initilizeButton("Add Parent", this.parents.length, () =>
      this.addParents()
    );
    this.initilizeButton("Add Spouse", false, () => {
      this.addSpouse();
    });
    this.initilizeButton("Delete", false, () => this.remove());
    this.initilizeButton("Close", false, () => this.hideButtons());
    this.initilizeInput(this.name, "textarea", (e) => {
      this.name = e.target.innerText;
      let pxIncreased = e.target.offsetHeight - inputHeight;

      this.h !== 80 + pxIncreased && this.resizeHeight(pxIncreased);
    });
    this.initilizeInput("????-????", "textarea", (e) => {
      this.lived = e.target.innerText;
      let pxIncreased = e.target.offsetHeight - inputHeight;

      this.h !== 80 + pxIncreased && this.resizeHeight(pxIncreased);
    });
  }

  initilizeInput(text, className, onChange) {
    let input = createElement("span", text);
    input.attribute("contenteditable", true);
    input.addClass(className);
    input.addClass("node-input");
    input.size(150);
    input.input(onChange);
    this.inputs.push(input);
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
      this.y - 100,
      this.name + "parent1",
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
      this.name + "spouse",
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

  draw() {
    designMode && this.update();
    designMode && this.over();
    rect(this.x, this.y, this.w, this.h);
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
