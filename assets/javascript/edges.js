
class Edges {
  constructor() {
    this.edges = [];
    this.selectedEdge = null;
  }

  addEdge(source, target, explicacion = null) {
    this.edges.push(new Edge(source, target, explicacion));
  }

  findEdge(x, y) {
    for (let edge of this.edges) {
      if (edge.isMouseOver(x, y)) {
        return edge;
      }
    }
    return null;
  }

  removeEdge(edge) {
    this.edges = this.edges.filter(e => e !== edge);
  }

  draw() {
    for (let edge of this.edges) {
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
    for (let edge of this.edges) {
      edge.selected = false;
    }
  }
}
