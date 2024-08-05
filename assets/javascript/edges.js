
class Edges {
  constructor() {
    this.edgesList = [];
    this.selectedEdge = null;
    this.edgeCounter = 0;
  }

  addEdge(source, target, explicacion = '') {
    this.edgesList.push(new Edge(source, target, explicacion));
    this.edgeCounter++;
  }

  changeEdge(oldExplicacion, newExplicacion){
    for (let edge of this.edgesList){
      if(edge.explicacion === oldExplicacion){
        edge.explicacion = newExplicacion;
      }
    }
  }

  removeEdge(edge) {
    this.edgesList = this.edgesList.filter(e => e.explicacion !== edge.explicacion);
    this.edgeCounter--;
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