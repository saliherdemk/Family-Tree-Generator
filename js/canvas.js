function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  // prepData();
}

function draw() {
  strokeWeight(2);
  background(255);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.draw();
  }

  fill(255);
  for (let i = 0; i < linkUps.length; i++) {
    const linkUp = linkUps[i];
    linkUp.draw();
  }

  noFill();

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    link.draw();
  }

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
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.pressed();
  }

  for (let i = 0; i < linkUps.length; i++) {
    const linkUp = linkUps[i];
    linkUp.pressed();
  }

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
