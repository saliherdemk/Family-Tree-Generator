// VARIABLES
var nodes = [];
var links = [];
var linkUps = [];
var canvas;
var designMode = false;
var canvasDragging = false;
var fileController;

const menuBtns = document.querySelectorAll(".btn");

// FILE CONTROLLER
class FileController {
  constructor() {
    this.data = null;
    this.newNodes = [];
  }

  setData(data) {
    this.data = data;
    this.newNodes = [];
  }

  addNewNode(node) {
    this.newNodes.push(node);
  }

  save(type) {
    if (type === "image") {
      saveCanvas(canvas, "My_Family_Tree", "png");
      return;
    }

    let jsonData = this.prepJson();
    this.download(JSON.stringify(jsonData), "data.json", "text/plain");
  }

  prepJson() {
    var obj = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      var children = node.links
        .map((link) => (link.linkUp ? link.linkUp?.children : []))
        .reduce((prev, current) => [...prev, ...current]);

      var newObj = {
        id: node.id,
        name: node.name,
        spouseIds: node.spouses.map((spouse) => spouse.id),
        children,
        lived: node.lived,
        x: node.x,
        y: node.y,
      };
      obj.push(newObj);
    }

    let jsonData = {
      data: obj,
    };
    return jsonData;
  }

  download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  createMembers() {
    var data = this.data;
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (element?.done) continue;
      let newNode = addMember(element.id, false);
      newNode.setCoordinates(element.x, element.y);

      newNode.setSpouses(element.spouseIds);
      newNode.setChildren(element.children);
      newNode.nodeUpdate(element.name, element.lived);
      this.addNewNode(newNode);
    }
  }

  createSpouseRelations() {
    var nodes = this.newNodes;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      let spouses = [];
      for (let i = 0; i < node.spouses.length; i++) {
        const spouseId = node.spouses[i];
        let spouse = this.getById(spouseId);
        spouses.push(spouse);
        if (spouse.spouses.includes(node)) continue;
        node.addSpouse(spouse);
      }

      node.setSpouses(spouses);
    }
  }

  createChildrenRelations() {
    var nodes = this.newNodes;
    for (let i = 0; i < nodes.length; i++) {
      const element = nodes[i];
      element.children.forEach((childId) => {
        let spouse = element.spouses.find((spouse) =>
          spouse.children.includes(childId)
        );
        let link = element.links.find((lnk) => lnk.source === spouse);
        if (link) {
          let child = this.getById(childId);
          link.linkUp.addChildren(child);
          element.children.push(child);
        }
      });
    }
  }

  importData() {
    this.createMembers();
    this.createSpouseRelations();
    this.createChildrenRelations();

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.children = node.children.filter((child) => child instanceof Node);
    }
  }

  getById(id) {
    return nodes.find((node) => node.id === id);
  }
}

// FUNCTIONS

function addMember(id = crypto.randomUUID(), init = true) {
  let newNode = new Node(id, 200, 100, "name", [], []);
  init && newNode.initilize();
  nodes.push(newNode);
  return newNode;
}

function toggleMenu() {
  let btns = Object.values(menuBtns).slice(0, -1);
  btns.forEach((btn) => {
    btn.classList.toggle("show");
  });
}

function handleSave(type) {
  fileController.save(type);
}

function toggleDesignMode() {
  designMode = !designMode;
  document.getElementById("mode-btn").classList.toggle("mode-off");
  document.querySelector(".options").classList.toggle("hidden");
}

// CANVAS
function setup() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  toggleDesignMode();
  canvas = createCanvas(windowWidth, windowHeight);
  fileController = new FileController();
  fileController.setData(data);
  fileController.importData();
  readOnly = true;
}

function draw() {
  strokeWeight(2);
  background(255);
  fill(255);
  for (let i = 0; i < linkUps.length; i++) {
    linkUps[i].preDraw();
  }
  noFill();
  for (let i = 0; i < links.length; i++) {
    links[i].draw();
  }
  fill(255);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].draw();
  }
  for (let i = 0; i < linkUps.length; i++) {
    linkUps[i].draw();
  }
  if (mouseIsPressed) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.update();
    }
  }
}

function mousePressed() {
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].pressed();
  }
  canvasDragging = true;
}

function mouseReleased() {
  canvasDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// DRAGGABLE
class Draggable {
  constructor() {
    this.dragging = false;
    this.globOffsetX;
    this.globOffsetY;
  }

  setCoordinates(x, y) {
    this.x = x;
    this.y = y;
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
    if (canvasDragging) {
      this.x = mouseX + this.globOffsetX;
      this.y = mouseY + this.globOffsetY;
    }
  }

  pressed() {
    this.globOffsetX = this.x - mouseX;
    this.globOffsetY = this.y - mouseY;
  }

  released() {
    this.dragging = false;
  }
}

// LINK
class Link {
  constructor(source, target, type, depth = 2) {
    this.source = source;
    this.target = target;
    this.type = type;
    this.linkUp = null;
    this.depth = depth;
  }

  setLinkUp(link) {
    this.linkUp = link;
  }

  draw() {
    if (this.type === "marriage") {
      beginShape();
      vertex(this.source.x + this.source.w / 2, this.source.y + this.source.h);
      vertex(
        this.source.x + this.source.w / 2,
        this.target.y + this.target.h + 40 * this.depth
      );
      vertex(
        this.target.x + this.target.w / 2,
        this.target.y + this.target.h + 40 * this.depth
      );
      vertex(this.target.x + this.target.w / 2, this.target.y + this.target.h);

      endShape();
    } else if (this.type === "children") {
      beginShape();
      vertex(this.source.x, this.source.y);
      vertex(this.target.x + this.target.w / 2, this.source.y);
      vertex(this.target.x + this.target.w / 2, this.target.y);
      endShape();
    }
  }
}

// LINKUP
class LinkUp {
  constructor(sourceLink) {
    this.sourceLink = sourceLink;
    this.x = null;
    this.y = null;
    this.r = 20;
    this.links = [];
    this.children = [];
  }

  addLink(link) {
    this.links.push(link);
  }

  addChildren(ch = null) {
    let parent1 = this.sourceLink.source;
    let parent2 = this.sourceLink.target;

    let newChild = ch
      ? ch
      : new Node(crypto.randomUUID(), this.x, this.y + 100, "name", [], []);
    let newLink = new Link(this, newChild, "children");
    links.push(newLink);
    !ch && newChild.initilize(newLink, [parent1, parent2]);
    ch && ch.addLink(newLink);
    this.addLink(newLink);
    this.children.push(newChild.id);
    !ch && nodes.push(newChild);
  }

  update() {
    this.x =
      this.sourceLink.source.x +
      75 +
      (this.sourceLink.target.x - this.sourceLink.source.x) / 2;
    this.y =
      this.sourceLink.target.y +
      this.sourceLink.target.h +
      40 * this.sourceLink.depth +
      40;
  }

  preDraw() {
    this.update();
    line(this.x, this.y, this.x, this.y - 40);
  }

  draw() {
    circle(this.x, this.y, this.r);
  }
}

// NODE
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
    this.links = [];
  }

  initilize(link = null, parents = []) {
    link && this.addLink(link);
    this.parents = parents;
  }

  addLink(link) {
    !this.links.includes(link) && this.links.push(link);
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
      "name",
      [],
      [this]
    );

    parent1.addSpouse();
    parent1.initilize();
    parent1.links[0].linkUp.addChildren(this);
    nodes.push(parent1);
  }

  addSpouse(sp = null) {
    let node = sp
      ? sp
      : new Node(crypto.randomUUID(), this.x + 200, this.y, "name", [this], []);
    !sp && this.spouses.push(node);

    let newLink = new Link(this, node, "marriage", this.spouses.length);
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
    fill(0);
    textSize(18);
    textAlign(CENTER);
    textWrap(WORD);
    text(content, x, y, w);
    fill(255);
  }

  preDraw() {
    this.update();
  }

  draw() {
    rect(this.x, this.y, this.w, this.h);
    noStroke();
    this.drawText(this.name, this.x, this.y + this.h / 4, this.w);
    this.drawText(this.lived, this.x, this.y + this.h - 20, this.w);
    stroke(0);
  }
}
