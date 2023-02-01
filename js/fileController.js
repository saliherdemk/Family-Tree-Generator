class FileController {
  constructor() {
    this.data = null;
    this.newNodes = [];
  }

  setData(data) {
    this.data = data;
    this.newNodes = [];
  }

  addNewNode(node) {
    this.newNodes.push(node);
  }

  save(type) {
    if (type === "image") {
      saveCanvas(canvas, "My_Family_Tree", "png");
      return;
    }

    let jsonData = this.prepJson();
    this.download(JSON.stringify(jsonData), "data.json", "text/plain");
  }

  prepJson() {
    var obj = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      var children = [];
      if (node.links.length) {
        children = node.links
          .map((link) =>
            link.linkUp
              ? link.linkUp?.children.filter(
                  (id) => this.getById(id) !== undefined
                )
              : []
          )
          .reduce((prev, current) => [...prev, ...current]);
      }
      console.log(children);
      var newObj = {
        id: node.id,
        name: node.name,
        spouseIds: node.spouses.map((spouse) => spouse.id),
        children,
        lived: node.lived,
        x: node.x,
        y: node.y,
        boxColor: node.boxColor,
        strokeColor: node.strokeColor,
        textColor: node.textColor,
      };
      obj.push(newObj);
    }

    let jsonData = {
      data: obj,
    };
    return jsonData;
  }

  download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  createMembers() {
    var data = this.data;
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (element?.done) continue;
      let newNode = addMember(element.id, false);
      newNode.setCoordinates(element.x, element.y);

      newNode.setSpouses(element.spouseIds);
      newNode.setChildren(element.children);
      newNode.nodeUpdate(
        element.name,
        element.lived,
        element.boxColor,
        element.strokeColor,
        element.textColor
      );
      this.addNewNode(newNode);
    }
  }

  createSpouseRelations() {
    var nodes = this.newNodes;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      let spouses = [];
      for (let i = 0; i < node.spouses.length; i++) {
        const spouseId = node.spouses[i];
        let spouse = this.getById(spouseId);
        spouses.push(spouse);
        if (spouse.spouses.includes(node)) continue;
        node.addSpouse(spouse);
      }

      node.setSpouses(spouses);
    }
  }

  createChildrenRelations() {
    var nodes = this.newNodes;
    for (let i = 0; i < nodes.length; i++) {
      const element = nodes[i];
      element.children.forEach((childId) => {
        let spouse = element.spouses.find((spouse) =>
          spouse.children.includes(childId)
        );
        let link = element.links.find((lnk) => lnk.source === spouse);
        if (link) {
          let child = this.getById(childId);
          link.linkUp.addChildren(child);
          element.children.push(child);
          child?.setParents([element, spouse]);
        }
      });
    }
  }

  resetCanvas() {
    nodes = [];
    links = [];
    linkUps = [];
  }

  importData() {
    this.resetCanvas();
    this.createMembers();
    this.createSpouseRelations();

    nodes.map((node) => !node.buttons.length && node.initilize());
    this.createChildrenRelations();
    nodes.map(
      (node) =>
        (node.children = node.children.filter((child) => child instanceof Node))
    );
  }

  getById(id) {
    return nodes.find((node) => node.id === id);
  }
}
