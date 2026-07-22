function setup() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  canvas = createCanvas(windowWidth, windowHeight);
  fileController = new FileController();
  select = new Select();

  if (typeof data !== "undefined") {
    designMode = false;
    fileController.setData(data);
    fileController.importData();
    document.getElementById("mode-btn")?.classList.add("mode-off");
    let label = document.getElementById("mode-label");
    if (label) label.textContent = "View";
    document.getElementById("toolbar")?.classList.add("hidden");
    document.getElementById("github-logo")?.classList.add("hidden");
  }
}

function draw() {
  if (canvasDragging) {
    panX = panDragStartPanX + (mouseX - panDragStartMouseX);
    panY = panDragStartPanY + (mouseY - panDragStartMouseY);
  }

  background(255);

  push();
  translate(panX, panY);
  scale(zoomLevel);
  strokeWeight(2);

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

  pop();
}

function mousePressed() {
  if (typeof event !== "undefined" && event.target && event.target.tagName === "CANVAS") {
    document.getElementById("toolbar")?.classList.remove("open");
  }
  designMode && mouseButton === LEFT && select.pressed();
  pressedAction(nodes);
  pressedAction(linkUps);
  if (mouseButton === RIGHT || mouseButton === CENTER || !designMode) {
    canvasDragging = true;
    panDragStartMouseX = mouseX;
    panDragStartMouseY = mouseY;
    panDragStartPanX = panX;
    panDragStartPanY = panY;
  }
}

function mouseReleased() {
  releasedAction(nodes);
  releasedAction(linkUps);

  select.released();

  canvasDragging = false;
}

function mouseWheel(event) {
  let factor = event.delta > 0 ? 0.9 : 1.1;
  zoomAtPoint(mouseX, mouseY, factor);
  return false;
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
