// document.addEventListener("contextmenu", (event) => event.preventDefault());
const graph = document.querySelector("#graph");
function prepData() {
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    lastId = Math.max(lastId, element.id);
    let newNode = new Node(
      element.id,
      (i + 2) * 150,
      element.depth * 100,
      element.name,
      element.spouseId,
      element.children
    );
    nodes.push(newNode);
  }

  nodes.forEach((node) => {
    if (node.spouse) {
      node.setSpouse(findNodeById(node.spouse));
    }
    let children = node.children.map((childId) => findNodeById(childId));

    node.setChildren(children);
  });

  nodes.forEach((node) => {
    node.children.forEach((child) => {
      node.parentLinkToChild(child);
    });
  });
}

function findNodeById(id) {
  return nodes.find((node) => node.id === id);
}

function changeMode() {
  if (designBtn.innerText === "Turn on Design Mode") {
    designMode = true;
    designBtn.innerText = "Turn off Design Mode";
    return;
  }
  designMode = false;
  designBtn.innerText = "Turn on Design Mode";
}

function updateNode(node) {
  console.log(node);
}

function deleteNode(node) {
  node.remove();
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (
      link?.source === node ||
      link?.target === node ||
      link?.sourceLink?.source === node ||
      link?.sourceLink?.target === node
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

function dist(x1, y1, x2, y2) {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}

function openPopup() {
  nameInp.value = selectedElementForUpdate.name;
  dateInp.value = selectedElementForUpdate.lived;

  document.querySelector(".popup-container").style.display = "flex";
}

function handlePopupInput() {
  selectedElementForUpdate.nodeUpdate(nameInp.value, dateInp.value);
  closePopup();
}

function closePopup() {
  nameInp.value = "";
  dateInp.value = "";
  document.querySelector(".popup-container").style.display = "none";
}

function toggleMenu() {
  document.querySelector(".menu-items-container").classList.toggle("hide-menu");
  document.querySelector(".menu-items-container").classList.toggle("show-menu");
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
