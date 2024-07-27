class Nodes {
  constructor(size) {
    this.nodesList = [];
    this.nodeCounter = 0;
    this.nodeSelected = null;
    this.size = size;
  }
  
  addNode(label, size, year, valencia) {
    let newNode = new Node(label, size, year, valencia);
    this.nodesList.push(newNode);
    this.nodeCounter++;
    return newNode;
  }

  clear() {
    this.nodesList = [];
    this.nodeCounter = 0;
    this.nodeSelected = null;
  }

  selectNode(node) {
    this.unSelectNodes();
    this.nodeSelected = node;
    node.select();
  }

  unSelectNodes() {
    this.nodesList.forEach(node => node.deselect());
    this.nodeSelected = null;
  }

  removeNode(node) {
    this.nodesList = this.nodesList.filter(n => n !== node);
  }

  draw(size) {
    for (let node of this.nodesList) {
      node.draw(size);
    }
  }

  setAllNodesInvisible() {
      this.nodesList.forEach(node => node.setVisible(false));
  }

  setAllNodesVisible() {
    this.nodesList.forEach(node => node.setVisible(true));
  }

  findNode(x, y, nodeSize = 20, zoomX = 1, zoomY = 1) {
    for (let node of this.nodesList) {
        // Ajuste dinámico de la distancia de detección
        let detectionRadius = (nodeSize / 2) / Math.max(zoomX, zoomY); // Utiliza el máximo de zoomX y zoomY

        // Calcula las coordenadas del nodo ajustadas por el zoom
        let adjustedNodeX = node.x * zoomX;
        let adjustedNodeY = node.y * zoomY;

        // Calcula la distancia ajustada con el zoom
        let d = dist(x, y, adjustedNodeX, adjustedNodeY);
        
        // Si la distancia es menor que el radio de detección ajustado
        if (d < detectionRadius) {
            return node;
        }
    }
    return null; // Devuelve null si no se encuentra ningún nodo dentro del radio de detección
  }


  updateNodes(currentTime) {
    for (let node of this.nodesList) {
        node.updateState(currentTime);
    }
  }

  applyRepulsion() {
    let repulsionForce = 0.1;
    let minDistance = 150;

    for (let i = 0; i < this.nodesList.length; i++) {
      for (let j = i + 1; j < this.nodesList.length; j++) {
        let nodeA = this.nodesList[i];
        let nodeB = this.nodesList[j];
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