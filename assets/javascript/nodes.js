class Nodes {
  constructor(size) {
    this.nodesList = [];
    this.nodeCounter = 0;
    this.nodeSelected = null;
    this.size = size;
  }

  length(){
    return nodesList.length;
  }
  
  addNode(year, valencia, label) {
    let newNode = new Node( year, valencia, label);
    this.nodesList.push(newNode);
    this.nodeCounter++;
    return newNode;
  }

  changeNode(oldLabel, newLabel){
    for (let node of this.nodesList){
      if(node.label === oldLabel){
        node.label = newLabel;
      }
    }
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

  deleteNode(node) {
    this.nodesList = this.nodesList.filter(n => n.label !== node.label);
    this.nodeCounter--;
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

function  findNodesUnderMouse(){
  // Devuelve los inventos visibles debajo del Ratón

  let inv_filtrados = [];

  if (state.modo == "editorMode"){
    const coordsReales = coordCanvasReales(mouseX, mouseY);
    const toleranciaX = 10 ;
    const toleranciaY = 1 ;

    inv_filtrados = state.graph.nodes.nodesList.filter(
      (invento) => (abs(invento.year - coordsReales.x)  < toleranciaX)  &&
                    (abs(invento.valencia - coordsReales.y)  < toleranciaY) &&
                    invento.visible == true );
  }

  if (state.modo == "timeLineMode"){
    const toleranciaX = 15 ;
    const toleranciaY = 15 ;

    inv_filtrados = state.gameNodes.filter(
      (invento) => (abs(invento.xGame - (mouseX + abs(scrollX) ))  < toleranciaX)  &&
                    (abs(invento.yGame - (mouseY + scrollY))  < toleranciaY) &&
                    invento.visible == true );
  }
  
  if (inv_filtrados.length > 0){
    state.nodesUnderMouse = inv_filtrados;
  } else {
    state.nodesUnderMouse = [];
  }
}