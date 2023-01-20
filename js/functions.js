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
  let btns = Object.values(menuBtns).slice(0, -1);
  btns.forEach((btn) => {
    btn.classList.toggle("show-btn");
  });
}

function trigger() {
  document.getElementById("fileid").click();
}
async function importJson(e) {
  const object = await parseJsonFile(e.target.files[0]);
  console.log(object);
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
  if (type === "image") {
    saveCanvas(canvas, "My_Family_Tree", "png");
    return;
  }

  var obj = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    var newObj = {
      id: node.id,
      name: node.name,
      spouseIds: node.spouses.map((spouse) => spouse.id),
      children: node.children.map((child) => child.id),
      lived: node.lived,
    };
    obj.push(newObj);
  }

  let jsonData = {
    data: obj,
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

function getData() {
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (element?.done) continue;
    let newNode = addMember(element.id, false);
    newNode.setSpouses(element.spouseIds);
    newNode.setChildren(element.children);
    newNode.nodeUpdate(element.name, element.lived);
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    let spouses = [];
    for (let i = 0; i < node.spouses.length; i++) {
      const spouseId = node.spouses[i];
      let spouse = getById(spouseId);
      spouses.push(spouse);
      if (spouse.spouses.includes(node)) continue;
      node.addSpouse(spouse);
    }

    node.setSpouses(spouses);
  }

  for (let i = 0; i < nodes.length; i++) {
    const element = nodes[i];
    element.children.forEach((childId) => {
      let spouse = element.spouses.find((spouse) =>
        spouse.children.includes(childId)
      );
      let link = element.links.find((lnk) => lnk.source === spouse);
      if (link) {
        let child = getById(childId);
        link.linkUp.addChildren(child);
        child.initilize(null, [link.source, link.target]);
        element.children.push(child);
      }
    });
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node.buttons.length) node.initilize();
    getDepth(node);
    node.updateHeight();
    node.children = node.children.filter((child) => child instanceof Node);
  }
}

function getDepth(node) {
  let el = node;
  if (el.spouses[0]) {
    el.depth = el.spouses[0].depth;
  }
  if (el.parents[0]) {
    el.depth = el.parents[0].depth + 1;
  }
}

function getById(id) {
  return nodes.find((node) => node.id === id);
}
