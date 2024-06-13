
class Nodos {
  constructor() {
    this.nodes = [];
    this.nodeCounter = 0;
  }

  addNode(x, y) {
    let newNode = new Nodo(x, y, (this.nodeCounter + 1).toString());
    this.nodes.push(newNode);
    this.nodeCounter++;
    return newNode;
  }

  removeNode(node) {
    let index = this.nodes.indexOf(node);
    if (index !== -1) {
      this.nodes.splice(index, 1);
    }
  }

  findNode(x, y) {
    for (let node of this.nodes) {
      let d = dist(x, y, node.x, node.y);
      if (d < 10) {
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

          nodeA.x -= fx / 2;
          nodeA.y -= fy / 2;
          nodeB.x += fx / 2;
          nodeB.y += fy / 2;

          nodeA.x = constrain(nodeA.x, 0, width);
          nodeA.y = constrain(nodeA.y, 0, height);
          nodeB.x = constrain(nodeB.x, 0, width);
          nodeB.y = constrain(nodeB.y, 0, height);
        }
      }
    }
  }

  draw() {
    for (let node of this.nodes) {
      node.draw();
    }
  }
}