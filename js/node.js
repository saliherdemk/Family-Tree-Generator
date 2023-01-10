class Node extends Draggable {
  constructor(id, x, y, name, spouse, children = []) {
    super(x, y);
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = 175;
    this.h = 80;
    this.name = name;
    this.lived = "????-????";
    this.spouse = spouse;
    this.children = children;
    this.linkUpToChildren = null;
    this.inputs = [];
    this.buttons = [];
    this.links = [];
    this.initilize();
  }

  resizeHeight(h) {
    this.h = 80 + h;
  }

  initilize() {
    let inputHeight = 21;
    this.initilizeButton("Add Parent", "", () => console.log("asd"));
    this.initilizeButton("Add Spouse", "", () => console.log("asd"));
    this.initilizeButton("Delete", "", () => this.remove());
    this.initilizeButton("Close", "", () => this.hideButtons());
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
    input.addClass("node-input", "relative");
    input.size(150);
    input.input(onChange);
    this.inputs.push(input);
  }

  initilizeButton(text, className, onPressed) {
    let button = createButton(text);
    button.position(this.x + this.w, this.y);
    button.addClass(className);
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

  setSpouse(node) {
    this.spouse = node;
    let isLinkExists = links.find(
      (link) =>
        (link.source === this && link.target === node) ||
        (link.source === node && link.target === this)
    );

    if (isLinkExists) return;

    let newLink = new Link(this, node, "marriage");
    links.push(newLink);
    let newLinkUp = new LinkUp(newLink);
    links.push(newLinkUp);

    this.addLink(newLink);
    this.addLink(newLinkUp);

    this.linkUpToChildren = node.linkUpToChildren = newLinkUp;

    let newCircle = new Circle(newLinkUp);
    circles.push(newCircle);

    newLinkUp.setCircle(newCircle);
  }

  setChildren(children) {
    this.children = children;
  }

  addChildren(child) {
    this.children.push(child);
    this.parentLinkToChild(child);
  }

  parentLinkToChild(child) {
    let isLinkExists = links.find(
      (link) => link.source === this.linkUpToChildren && link.target === child
    );
    if (isLinkExists) return;
    let newLink = new Link(this.linkUpToChildren, child, "children");
    links.push(newLink);
    this.addLink(newLink);
    this.spouse.addLink(newLink);
  }

  draw() {
    rect(this.x, this.y, this.w, this.h);
  }

  remove() {
    this.linkUpToChildren?.remove();

    removeElement(nodes, this);

    this.buttons.forEach((btn) => {
      btn.remove();
    });

    for (let i = 0; i < this.links.length; i++) {
      const link = this.links[i];
      link.remove();
    }
  }
}
