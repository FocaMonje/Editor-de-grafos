class GraphManager {
  constructor(nodos) {
    this.nodos = nodos;
    this.edges = [];
    this.updateGraph();
  }

  updateGraph() {
    this.graph = {
      directed: true,
      graph: {},
      nodes: this.nodos.nodes.map(node => ({ id: node.label })),
      links: this.edges.map(edge => ({
        source: edge[0]?.label,
        target: edge[1]?.label
      })).filter(link => link.source && link.target),
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
        }
      };
      reader.readAsText(file.file);
    }
  }

  drawEdges() {
    stroke(0);
    for (let edge of this.edges) {
      let nodeA = edge[0];
      let nodeB = edge[1];
      if (nodeA && nodeB) {
        line(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
      }
    }
  }
}