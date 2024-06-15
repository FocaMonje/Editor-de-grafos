
class Nodos {
  constructor() {
    this.nodes = [];
    this.nodeCounter = 0;
    this.nodeSelected = null;
  }

  addNode(x, y) {
    let newNode = new Nodo(x, y, (this.nodeCounter + 1).toString());
    this.nodes.push(newNode);
    this.nodeCounter++;
    return newNode;
  }

  selectNode(node){
    this.unSelectNodes();
    this.nodeSelected = node;
    node.select();
  }

  unSelectNodes(){

    this.nodes.forEach(node => {
      if (node.selected === true) {
        node.selected= false;
      }});
    this.nodeSelected = null;
  }

  removeNode(node) {
    this.nodes = this.nodes.filter(n => n !== node);
  }

  draw() {
    for (let node of this.nodes) {
      node.draw();
    }
  }

  findNode(mouseXAdj, mouseYAdj) {
    for (let node of this.nodes) {
      if (node.isMouseOver(mouseXAdj, mouseYAdj)) {
        return node;
      }
    }
    return null;
  }

  applyRepulsion() {
    let repulsionForce = 0.1;
    let minDistance = 150;

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        let nodeA = this.nodes[i];
        let nodeB = this.nodes[j];
        let dx = nodeB.x - nodeA.x;
        let dy = nodeB.y - nodeA.y;
        let distance = dist(nodeA.x, nodeA.y, nodeB.x, nodeB.y);

        if (distance < minDistance) {
          let angle = atan2(dy, dx);
          let force = (minDistance - distance) * repulsionForce;
          let fx = cos(angle) * force;
          let fy = sin(angle) * force;

          nodeA.move(fx, fy);
          nodeB.move(-fx, -fy);

          nodeA.x = constrain(nodeA.x, 0, width);
          nodeA.y = constrain(nodeA.y, 0, height);
          nodeB.x = constrain(nodeB.x, 0, width);
          nodeB.y = constrain(nodeB.y, 0, height);
        }
      }
    }
  }
}
