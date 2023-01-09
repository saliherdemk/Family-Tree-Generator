class Link {
  constructor(source, target) {
    this.source = source;
    this.target = target;
  }

  draw() {
    bezier(
      this.source.x,
      this.source.y + 40,
      this.target.x + 100,
      this.target.y + 40,
      this.target.x,
      this.target.y + 40,
      this.target.x,
      this.target.y + 40
    );
  }
}
