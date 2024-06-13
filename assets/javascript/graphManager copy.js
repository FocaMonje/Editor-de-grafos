
class GraphManager {
  constructor(nodos) {
    this.nodos = nodos;
    this.edges = [];
    this.graph = this.createGraph();  // Inicializar el grafo
  }

  createGraph() {
    return {
      directed: true,
      graph: {},
      nodes: this.nodos.nodes.map((node, index) => ({ id: `N${index + 1}` })),
      links: this.edges.map(edge => ({
        source: `N${this.nodos.nodes.indexOf(edge[0]) + 1}`,
        target: `N${this.nodos.nodes.indexOf(edge[1]) + 1}`
      })),
      multigraph: false
    };
  }

  addEdge(node1, node2) {
    this.edges.push([node1, node2]);
    this.updateGraph();
  }

  removeEdgesConnectedToNode(node) {
    this.edges = this.edges.filter(edge => edge[0] !== node && edge[1] !== node);
    this.updateGraph();
  }

  updateGraph() {
    this.graph = {
      directed: true,
      graph: {},
      nodes: this.nodos.nodes.map((node, index) => ({ id: `N${index + 1}` })),
      links: this.edges.map(edge => ({
        source: `N${this.nodos.nodes.indexOf(edge[0]) + 1}`,
        target: `N${this.nodos.nodes.indexOf(edge[1]) + 1}`
      })),
      multigraph: false
    };
  }

  saveGraph() {
    saveJSON(this.graph, 'graph.json');
  }

  loadGraph(callback) {
    let input = createFileInput(file => this.handleFile(file, callback));
    input.hide();
    input.elt.click();
  }

  handleFile(file, callback) {
    if (file.type === 'application' && file.subtype === 'json') {
      try {
        let graph = JSON.parse(file.data);
        callback(graph);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }

  drawEdges() {
    stroke(0);
    for (let edge of this.edges) {
      let nodeA = edge[0];
      let nodeB = edge[1];
      line(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
    }
  }
}
  