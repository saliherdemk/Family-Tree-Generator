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

function addMember() {
  let newNode = new Node(crypto.randomUUID(), 200, 100, "name", [], []);
  newNode.initilize();
  nodes.push(newNode);
}

function openPopup() {
  nameInp.value = selectedElementForUpdate.name;
  dateInp.value = selectedElementForUpdate.lived;

  popupContainer.style.display = "flex";
}

function handlePopupInput() {
  selectedElementForUpdate.nodeUpdate(nameInp.value, dateInp.value);
  closePopup();
}

function closePopup() {
  nameInp.value = "";
  dateInp.value = "";
  popupContainer.style.display = "none";
}

function toggleMenu() {
  menuItemsContainer.classList.toggle("hide-menu");
  menuItemsContainer.classList.toggle("show-menu");
}

function handleSave(type) {
  if (type === "image") {
    saveCanvas(canvas, "My_Family_Tree", "png");
    return;
  }

  let jsonData = {
    nodes: nodes,
    links: links,
    linkUps: linkUps,
  };

  download(JSON.stringify(jsonData), "yourfile.json", "text/plain");
}

function download(content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
