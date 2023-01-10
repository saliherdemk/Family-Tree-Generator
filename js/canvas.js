function setup() {
  createCanvas(windowWidth, windowHeight - 4);
  // prepData();
}

function draw() {
  strokeWeight(2);
  background(255);

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    link.draw();
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    designMode && node.update();
    designMode && node.over();
    node.draw();
  }

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    designMode && circle.over();
    circle.draw();
  }
}

function mousePressed() {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.pressed();
  }

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    circle.pressed();
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
    node.updateNode();
  }
}
