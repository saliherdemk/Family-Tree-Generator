function setup() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  canvas = createCanvas(windowWidth, windowHeight);
}

function draw() {
  strokeWeight(2);
  background(255);

  preDrawAction(nodes);

  fill(255);

  preDrawAction(linkUps);

  noFill();
  drawAction(links);

  fill(255);

  drawAction(nodes);

  drawAction(linkUps);

  if (mouseButton === RIGHT) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      node.updateCoordinates(true);
    }
  }
}

function mousePressed() {
  pressedAction(nodes);
  pressedAction(linkUps);

  canvasDragging = mouseButton === RIGHT;
}

function mouseReleased() {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.released();
  }
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
