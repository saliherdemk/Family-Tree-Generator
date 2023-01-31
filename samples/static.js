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
        boxColor: node.boxColor,
        strokeColor: node.strokeColor,
        textColor: node.textColor,
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
      newNode.nodeUpdate(
        element.name,
        element.lived,
        element.boxColor,
        element.strokeColor,
        element.textColor
      );
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

function gradientLine(x1, y1, x2, y2, color1, color2) {
  // linear gradient from start to end of line
  var grad = this.drawingContext.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);

  this.drawingContext.strokeStyle = grad;

  line(x1, y1, x2, y2);
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// CANVAS
function setup() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  toggleDesignMode();
  canvas = createCanvas(windowWidth, windowHeight);
  fileController = new FileController();
  fileController.setData(data);
  fileController.importData();
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
    this.midColor = "#000000";
  }

  setLinkUp(link) {
    this.linkUp = link;
  }

  setMidColor() {
    let clr1 = hexToRgb(this.source.strokeColor);
    let clr2 = hexToRgb(this.target.strokeColor);
    let newValues = [];
    for (let i = 0; i < clr1.length; i++) {
      newValues[i] = (clr1[i] + clr2[i]) / 2;
    }
    this.midColor = rgbToHex(newValues[0], newValues[1], newValues[2]);
  }

  draw() {
    let source = this.source;
    let target = this.target;
    let x2 = target.x + target.w / 2;
    if (this.type === "marriage") {
      let x1 = source.x + source.w / 2;
      let y1 = target.y + target.h + 40 * this.depth;

      stroke(source.strokeColor);
      line(x1, source.y + source.h, x1, y1);
      gradientLine(x1, y1, x2, y1, source.strokeColor, target.strokeColor);
      stroke(target.strokeColor);
      line(x2, y1, x2, target.y + target.h);
      stroke(0);
    } else if (this.type === "children") {
      stroke(this.source.color);
      beginShape();
      vertex(source.x, source.y);
      vertex(x2, source.y);
      vertex(x2, target.y);
      endShape();
      stroke(0);
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
    this.color = "#000000";
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
    this.color = this.sourceLink.midColor;
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
    this.boxColor = "#ffffff";
    this.strokeColor = "#000000";
    this.textColor = "#000000";
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
  }

  draw() {
    fill(color(this.boxColor));
    rect(this.x, this.y, this.w, this.h);
    noFill();
    noStroke();
    this.drawText(this.name, this.x, this.y + this.h / 4, this.w);
    this.drawText(this.lived, this.x, this.y + this.h - 20, this.w);
    stroke(0);
  }
}
