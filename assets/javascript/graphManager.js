
class GraphManager {
  constructor(nodos) {
    this.nodos = nodos;
    this.edges = new Edges();
    this.updateGraph();
  }

  updateGraph() {
    this.graph = {
      directed: true,
      graph: {},
      nodes: this.nodos.nodes.map(node => ({ id: node.label })),
      links: this.edges.edges.map(edge => ({
        source: edge.source.label,
        target: edge.target.label,
        explicacion : edge.explicacion  // Información asociada a la flecha
      })).filter(link => link.source && link.target),
      multigraph: false
    };
  }

  addEdge(node1, node2, explicacion = '') {
    this.edges.addEdge(node1, node2, explicacion);
    this.updateGraph();
  }

  removeEdgesConnectedToNode(node) {
    this.edges.removeEdgesConnectedToNode(node);
    this.updateGraph();
  }

  removeEdge(edge) {
    this.edges.edges = this.edges.edges.filter(e => e !== edge);
    this.updateGraph();
  }

  saveGraph() {
    this.updateGraph();
    saveJSON(this.graph, 'graph.json');
  }

  loadGraph(callback) {
    let input = createFileInput(file => this.handleFile(file, callback));
    input.hide();
    input.elt.click();
  }

  handleFile(file, callback) {
    if (file && file.type === 'application' && file.subtype === 'json') {
      let reader = new FileReader();
      reader.onload = event => {
        try {
          let graph = JSON.parse(event.target.result);
          callback(graph);
        } catch (error) {
          console.error("Error parsing graph JSON:", error);
        }
      };
      reader.readAsText(file.file);
    }
  }

  drawEdges() {
    this.edges.draw();
  }
}