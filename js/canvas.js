function setup() {
  createCanvas(windowWidth, windowHeight);

  // prepData();
}

function draw() {
  strokeWeight(2);
  background(255);

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    link.draw();
  }

  for (let i = 0; i < linkUps.length; i++) {
    const linkUp = linkUps[i];
    linkUp.draw();
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.draw();
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
}

function mouseReleased() {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.released();
  }
}

function doubleClicked() {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.specifyElement();
  }
}
