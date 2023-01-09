class Link {
  constructor(source, target, type) {
    this.source = source;
    this.target = target;
    this.type = type;
  }

  draw() {
    if (this.type === "marriage") {
      line(
        this.source.x + 25,
        this.source.y + 40,
        this.target.x + 25,
        this.target.y + 40
      );
    } else if (this.type === "children") {
      beginShape();
      vertex(this.source.x, this.source.y);
      vertex(this.target.x + this.target.w / 2, this.source.y);
      vertex(this.target.x + this.target.w / 2, this.target.y);

      endShape();
    }
  }
}

class LinkUp {
  constructor(sourceLink) {
    this.sourceLink = sourceLink;
    this.x = null;
    this.y = null;
  }

  update() {
    this.x =
      this.sourceLink.source.x +
      75 +
      (this.sourceLink.target.x - this.sourceLink.source.x) / 2;
    this.y = this.endPoint = this.sourceLink.target.y + 120;
  }

  draw() {
    this.update();
    line(this.x, this.sourceLink.target.y + 40, this.x, this.y);
  }
}
