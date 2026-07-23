function preDrawAction(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].preDraw();
  }
}

function drawAction(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].draw();
  }
}

function pressedAction(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].pressed();
  }
}

function releasedAction(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].released();
  }
}

function dist(x1, y1, x2, y2) {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}

function deleteNode(node) {
  node.remove();
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (
      [
        link?.source,
        link?.target,
        link?.sourceLink?.source,
        link?.sourceLink?.target,
      ].includes(node)
    ) {
      link.remove();
    }
  }
}

function removeElement(arr, el) {
  const index = arr.indexOf(el);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

function addMember(id = crypto.randomUUID(), init = true) {
  let newNode = new Node(id, 200, 100, "Unknown", [], []);
  init && newNode.initilize();
  nodes.push(newNode);
  return newNode;
}

function openPopup() {
  nameInp.value = selectedElementForUpdate.name;
  dateInp.value = selectedElementForUpdate.lived;
  boxColorInp.value = selectedElementForUpdate.boxColor;
  strokeColorInp.value = selectedElementForUpdate.strokeColor;
  textColorInp.value = selectedElementForUpdate.textColor;

  popupContainer.style.display = "flex";
  noLoop();
}

function handlePopupInput() {
  selectedElementForUpdate.nodeUpdate(
    nameInp.value,
    dateInp.value,
    boxColorInp.value,
    strokeColorInp.value,
    textColorInp.value,
  );
  closePopup();
}

function closePopup() {
  nameInp.value = "";
  dateInp.value = "";
  popupContainer.style.display = "none";
  loop();
}

function toggleMenu() {
  document.getElementById("toolbar")?.classList.toggle("open");
}

function trigger() {
  document.getElementById("fileid").click();
}

async function importJson(e) {
  const jsonData = await parseJsonFile(e.target.files[0]);
  fileController.setData(jsonData.data);
  fileController.importData();
}

async function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}

function handleSave(type) {
  fileController.save(type);
}

function closeInformation() {
  document.querySelector(".info-container").style.display = "none";
}

function toggleDesignMode() {
  designMode = !designMode;
  document.getElementById("mode-btn")?.classList.toggle("mode-off");
  let label = document.getElementById("mode-label");
  if (label) label.textContent = designMode ? "Design" : "View";
  document.getElementById("toolbar")?.classList.toggle("hidden");
  document.getElementById("toolbar")?.classList.remove("open");
  document.getElementById("github-logo")?.classList.toggle("hidden");

  nodes.forEach((node) => {
    node.hideButtons();
  });
}

function gradientLine(x1, y1, x2, y2, color1, color2) {
  // linear gradient from start to end of line
  var grad = this.drawingContext.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);

  this.drawingContext.strokeStyle = grad;

  line(x1, y1, x2, y2);
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function screenToWorld(sx, sy) {
  return { x: (sx - panX) / zoomLevel, y: (sy - panY) / zoomLevel };
}

function worldToScreen(wx, wy) {
  return { x: wx * zoomLevel + panX, y: wy * zoomLevel + panY };
}

function zoomAtPoint(sx, sy, factor) {
  let oldZoom = zoomLevel;
  let newZoom = constrain(zoomLevel * factor, 0.05, 10);
  if ((oldZoom < 1 && newZoom >= 0.95) || (oldZoom > 1 && newZoom <= 1.05)) {
    newZoom = 1;
  }
  zoomLevel = newZoom;
  panX = sx - (sx - panX) * (zoomLevel / oldZoom);
  panY = sy - (sy - panY) * (zoomLevel / oldZoom);
  updateZoomDisplay();
}

function zoomIn() {
  zoomAtPoint(windowWidth / 2, windowHeight / 2, 1.2);
}

function zoomOut() {
  zoomAtPoint(windowWidth / 2, windowHeight / 2, 1 / 1.2);
}

function resetZoom() {
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  updateZoomDisplay();
}

function updateZoomDisplay() {
  let el = document.getElementById("zoom-display");
  if (el) el.textContent = Math.round(zoomLevel * 100) + "%";
}
