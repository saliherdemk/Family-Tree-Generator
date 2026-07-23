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
  if (isTouching) return;

  if (typeof e !== "undefined" && e.target && e.target.tagName === "CANVAS") {
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
  if (isTouching) return;

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

function touchStarted() {
  isTouching = true;

  if (touches.length >= 2) {
    let t1 = touches[0];
    let t2 = touches[1];
    pinchStartDist = Math.hypot(t1.x - t2.x, t1.y - t2.y);
    pinchStartZoom = zoomLevel;
    touchPanActive = false;
    touchDragActive = false;
    clearTimeout(longPressTimer);
    return false;
  }

  let tx = mouseX;
  let ty = mouseY;
  touchStartX = tx;
  touchStartY = ty;
  let world = screenToWorld(tx, ty);

  touchedNodeRef = null;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (
      world.x > node.x &&
      world.x < node.x + node.w &&
      world.y > node.y &&
      world.y < node.y + node.h
    ) {
      touchedNodeRef = node;
      break;
    }
  }

  let now = millis();
  if (
    now - lastTapTime < 300 &&
    lastTapNode === touchedNodeRef &&
    touchedNodeRef
  ) {
    clearTimeout(longPressTimer);
    if (designMode) {
      touchedNodeRef.specifyElement();
    }
    lastTapTime = 0;
    lastTapNode = null;
    touchedNodeRef = null;
    return false;
  }
  lastTapTime = now;
  lastTapNode = touchedNodeRef;

  clearTimeout(longPressTimer);
  longPressTriggered = false;
  if (touchedNodeRef && designMode) {
    let ref = touchedNodeRef;
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      ref.showButtons();
    }, 500);
  }

  if (!touchedNodeRef || !designMode) {
    touchPanActive = true;
    canvasDragging = true;
    panDragStartMouseX = tx;
    panDragStartMouseY = ty;
    panDragStartPanX = panX;
    panDragStartPanY = panY;
    document.getElementById("toolbar")?.classList.remove("open");
  }

  return false;
}

function touchMoved() {
  if (touches.length >= 2) {
    let t1 = touches[0];
    let t2 = touches[1];
    let currentDist = Math.hypot(t1.x - t2.x, t1.y - t2.y);
    let factor = currentDist / pinchStartDist;
    let midX = (t1.x + t2.x) / 2;
    let midY = (t1.y + t2.y) / 2;

    let oldZoom = zoomLevel;
    zoomLevel = constrain(pinchStartZoom * factor, 0.05, 10);
    if (
      (oldZoom < 1 && zoomLevel >= 0.95) ||
      (oldZoom > 1 && zoomLevel <= 1.05)
    ) {
      zoomLevel = 1;
    }
    panX = midX - (midX - panX) * (zoomLevel / oldZoom);
    panY = midY - (midY - panY) * (zoomLevel / oldZoom);
    updateZoomDisplay();

    return false;
  }

  if (touches.length === 1) {
    let t = touches[0];
    let moveDist = Math.hypot(t.x - touchStartX, t.y - touchStartY);

    if (moveDist > 10) {
      clearTimeout(longPressTimer);

      if (
        !touchPanActive &&
        touchedNodeRef &&
        !touchDragActive &&
        !longPressTriggered
      ) {
        let world = screenToWorld(mouseX, mouseY);
        touchedNodeRef.dragging = true;
        touchedNodeRef.offsetX = touchedNodeRef.x - world.x;
        touchedNodeRef.offsetY = touchedNodeRef.y - world.y;
        touchDragActive = true;
        select.released();
      }
    }
  }

  return false;
}

function touchEnded() {
  clearTimeout(longPressTimer);

  if (touches.length === 1 && !touchPanActive && !touchDragActive) {
    let t = touches[0];
    canvasDragging = true;
    touchPanActive = true;
    panDragStartMouseX = t.x;
    panDragStartMouseY = t.y;
    panDragStartPanX = panX;
    panDragStartPanY = panY;
  }

  if (touches.length === 0) {
    if (touchDragActive && touchedNodeRef) {
      touchedNodeRef.dragging = false;
    }
    touchPanActive = false;
    touchDragActive = false;
    canvasDragging = false;
    touchedNodeRef = null;
    longPressTriggered = false;
    isTouching = false;

    releasedAction(nodes);
    releasedAction(linkUps);
    select.released();
  }

  return false;
}
