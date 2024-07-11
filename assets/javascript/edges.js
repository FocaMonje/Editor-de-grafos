
class Edges {
  constructor() {
    this.edgesList = [];
    this.selectedEdge = null;
  }

  addEdge(source, target, explicacion = null) {
    this.edgesList.push(new Edge(source, target, explicacion));
  }

  findEdge(x, y) {
    for (let edge of this.edgesList) {
      if (edge.isMouseOver(x, y)) {
        return edge;
      }
    }
    return null;
  }

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