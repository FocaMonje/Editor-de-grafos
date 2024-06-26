class Nodos {
  constructor(size) {
    this.nodes = [];
    this.nodeCounter = 0;
    this.nodeSelected = null;
    this.size = size;
  }

  addNode(x, y, size) {
    let newNode = new Nodo(x, y, (this.nodeCounter + 1).toString(), size);
    this.nodes.push(newNode);
    this.nodeCounter++;
    return newNode;
  }

  clear() {
    this.nodes = [];
    this.nodeCounter = 0;
    this.nodeSelected = null;
  }

  selectNode(node) {
    this.unSelectNodes();
    this.nodeSelected = node;
    node.select();
  }

  unSelectNodes() {
    this.nodes.forEach(node => node.deselect());
    this.nodeSelected = null;
  }

  removeNode(node) {
    this.nodes = this.nodes.filter(n => n !== node);
  }

  draw(size) {
    for (let node of this.nodes) {
      node.draw(size);
    }
  }

  findNode(x, y, nodeSize = 20, zoomFactor = 1) {
    for (let node of this.nodes) {
        // Ajuste dinámico de la distancia de detección
        let detectionRadius = (nodeSize / 2) / zoomFactor;
        let d = dist(x, y, node.x, node.y);
        
        // Si la distancia es menor que el radio de detección ajustado
        if (d < detectionRadius) {
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
