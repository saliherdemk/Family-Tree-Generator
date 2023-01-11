let offset;
function setup() {
  let cnv = createCanvas(9000, 9000);
  offset = createVector(0, 0);

  // prepData();
}

function draw() {
  const mouse = createVector(mouseX, mouseY);
  const relativeMouse = mouse.copy().sub(offset);

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

  if (mouseIsPressed && mouseButton === RIGHT) {
    offset.x -= pmouseX - mouseX;
    offset.y -= pmouseY - mouseY;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].updateCoordinates(true);
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
