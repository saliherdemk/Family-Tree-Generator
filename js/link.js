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

  remove(fromChild = false) {
    removeElement(links, this);
    this.linkUp?.remove();
    !fromChild && this.target.remove();
  }
}

class LinkUp {
  constructor(sourceLink) {
    this.sourceLink = sourceLink;
    this.x = null;
    this.y = null;
    this.r = 20;
    this.rollover = false;
    this.links = [];
    this.children = [];
    this.isActive = false;
    this.color = "#000000";
  }

  over() {
    if (sqrt(sq(this.x - mouseX) + sq(this.y - mouseY)) < this.r / 2) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  pressed() {
    this.isActive = this.rollover;
    this.rollover && select.released();
  }

  released() {
    if (this.rollover) {
      this.addChildren();
    } else if (this.isActive) {
      let childNode = nodes.find((node) => node.rollover === true);
      if (childNode) {
        this.removeChildren(childNode);
        this.addChildren(childNode, true);
      }
    }
    this.isActive = false;
  }

  addLink(link) {
    this.links.push(link);
  }

  removeLink(link) {
    removeElement(this.links, link);
  }

  addChildren(ch = null, force = false) {
    let parent1 = this.sourceLink.source;
    let parent2 = this.sourceLink.target;

    let newChild = ch
      ? ch
      : new Node(crypto.randomUUID(), this.x, this.y + 100, "Unknown", [], []);
    let newLink = new Link(this, newChild, "children");
    links.push(newLink);
    !ch && newChild.initilize(newLink, [parent1, parent2]);
    this.addLink(newLink);
    this.children.push(newChild.id);
    !ch && nodes.push(newChild);

    ch && ch.addLink(newLink);
    force && ch.buttons[0].attribute("disabled", "");
    force && ch.buttons[0].addClass("disabled");
  }

  removeChildren(child, fromNode = true) {
    this.children = this.children.filter((ch) => ch !== child.id);
    if (child instanceof Node && fromNode) {
      let link = child.links.find((lnk) => lnk.type === "children");
      link?.source.removeChildren(child, false);
      link?.source.removeLink(link);
      link?.remove(true);
      child.removeLink(link);
      child.setParents([]);
    }
  }

  update() {
    this.r = this.rollover ? 30 : 20;
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
    designMode && this.over();
    this.update();
    stroke(this.color);
    line(this.x, this.y, this.x, this.y - 40);
    stroke(0);
  }

  draw() {
    if (this.isActive) {
      line(this.x, this.y, mouseX, mouseY);
    }
    circle(this.x, this.y, this.r);
  }

  remove() {
    removeElement(linkUps, this);
    this.links.forEach((link) => {
      link.remove();
    });
  }
}
