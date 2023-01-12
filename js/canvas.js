function setup() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  canvas = createCanvas(windowWidth, windowHeight);
}

function draw() {
  strokeWeight(2);
  background(255);

  drawAction(nodes);

  fill(255);
  drawAction(linkUps);

  noFill();
  drawAction(links);

  fill(255);
  for (let i = 0; i < linkUps.length; i++) {
    const linkUp = linkUps[i];
    linkUp.drawCircle();
  }

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
