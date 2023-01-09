function setup() {
  createCanvas(windowWidth, windowHeight - 4);
  prepData();
}

function draw() {
  background(255);

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    link.draw();
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.update();
    node.over();
    node.draw();
  }
}

function mousePressed() {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.pressed();
  }
}

function mouseReleased() {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.released();
  }
}
