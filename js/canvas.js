function setup() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  canvas = createCanvas(windowWidth, windowHeight);
  fileController = new FileController();
  select = new Select();
}

function draw() {
  strokeWeight(2);
  background(255);

  if (designMode) {
    select.draw();
    preDrawAction(nodes);
  }

  fill(255);

  preDrawAction(linkUps);

  noFill();
  drawAction(links);

  fill(255);

  drawAction(nodes);

  drawAction(linkUps);

  if (mouseButton === RIGHT || !designMode) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.updateCoordinates();
    }
  }
}

function mousePressed() {
  pressedAction(nodes);
  pressedAction(linkUps);
  designMode &&
    mouseButton === LEFT &&
    !nodes.find((node) => node.dragging === true) &&
    select.pressed();
  canvasDragging = mouseButton === RIGHT || !designMode;
}

function mouseReleased() {
  releasedAction(nodes);
  releasedAction(linkUps);

  select.released();

  canvasDragging = false;
}

function doubleClicked() {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.specifyElement();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
