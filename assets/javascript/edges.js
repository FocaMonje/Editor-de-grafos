
class Edges {
  constructor() {
    this.edgesList = [];
    this.selectedEdge = null;
    this.edgeCounter = 0;
  }

  addEdge(source, target, explicacion = null) {
    this.edgesList.push(new Edge(source, target, explicacion));
    this.edgeCounter++;
  }

  // findEdgeUnderMouse() {
  //   let coordenadas = coordCanvasReales(mouseX, mouseY);
  //   let x = coordenadas.x;
  //   let y = coordenadas.y;
    
  //   for (let edge of this.edgesList) {
  //     if (edge.isMouseOver(x, y)) {
  //       return edge;
  //     }
  //   }
  //   return null;
  // }

  removeEdge(edge) {
    this.edgesList = this.edgesList.filter(e => e !== edge);
  }

  draw() {
    for (let edge of this.edgesList) {
      edge.draw();
    }
  }

  selectEdge(edge) {
    this.unselectEdges();
    this.selectedEdge = edge;
    edge.select();
  }

  unselectEdges() {
    this.selectedEdge = null;
    for (let edge of this.edgesList) {
      edge.selected = false;
    }
  }
}