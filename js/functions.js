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
  let newNode = new Node(id, 200, 100, "name", [], []);
  init && newNode.initilize();
  nodes.push(newNode);
  return newNode;
}

function openPopup() {
  nameInp.value = selectedElementForUpdate.name;
  dateInp.value = selectedElementForUpdate.lived;

  popupContainer.style.display = "flex";
  noLoop();
}

function handlePopupInput() {
  selectedElementForUpdate.nodeUpdate(nameInp.value, dateInp.value);
  closePopup();
}

function closePopup() {
  nameInp.value = "";
  dateInp.value = "";
  popupContainer.style.display = "none";
  loop();
}

function toggleMenu() {
  let btns = Object.values(menuBtns).slice(0, -1);
  btns.forEach((btn) => {
    btn.classList.toggle("show");
  });
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
  document.getElementById("mode-btn").classList.toggle("mode-off");
  document.querySelector(".options").classList.toggle("hidden");

  nodes.forEach((node) => {
    node.hideButtons();
  });
}
