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
      noFill();
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

      // line(
      //   this.source.x + 25,
      //   this.source.y + 40,
      //   this.target.x + 25,
      //   this.target.y + 40
      // );
    } else if (this.type === "children") {
      beginShape();
      vertex(this.source.x, this.source.y);
      vertex(this.target.x + this.target.w / 2, this.source.y);
      vertex(this.target.x + this.target.w / 2, this.target.y);
      endShape();
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
  }

  over() {
    if (sqrt(sq(this.x - mouseX) + sq(this.y - mouseY)) < this.r / 2) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  pressed() {
    this.rollover && this.addChildren();
  }

  addLink(link) {
    this.links.push(link);
  }

  addChildren() {
    let parent1 = this.sourceLink.source;
    let parent2 = this.sourceLink.target;

    let newChild = new Node(
      crypto.randomUUID(),
      this.x,
      this.y + 100,
      "name",
      [],
      []
    );
    let newLink = new Link(this, newChild, "children");
    links.push(newLink);
    newChild.initilize(newLink, [parent1, parent2]);

    this.addLink(newLink);

    nodes.push(newChild);
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
  }

  draw() {
    fill(255);
    this.over();
    this.update();
    line(this.x, this.y, this.x, this.y - 40);
    circle(this.x, this.y, this.r);
  }

  remove() {
    removeElement(linkUps, this);
    this.links.forEach((link) => {
      console.log(link);
      link.remove();
    });
  }
}
