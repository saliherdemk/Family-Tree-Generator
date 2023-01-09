var nodes = [];
var links = [];
var drag;
function prepData() {
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    let newNode = new Node(
      element.id,
      i * 100,
      50,
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
    if (node.spouse) {
      let newLink = new Link(node, node.spouse);
      links.push(newLink);
    }

    node.children.forEach((child) => {
      let newLink = new Link(node, child);
      links.push(newLink);
    });
  });
}

function findNodeById(id) {
  return nodes.find((node) => node.id === id);
}
