
class GraphManager {
  constructor(nodos,physics) {
    this.nodos = nodos;
    this.edges = new Edges();
    this.updateGraph();
    this.physics = physics;
  }

  updateGraph() {
    this.graph = {
      directed: true,
      graph: {},
      nodes: this.nodos.nodes.map(node => ({ id: node.label, year: node.year })),    // Guardar el año en el nodo
      links: this.edges.edgesList.map(edge => ({
        source: edge.source.label,
        target: edge.target.label,
        explicacion: edge.explicacion  // Información asociada a la flecha
      })).filter(link => link.source && link.target),
      multigraph: false
    };
  }

  addEdge(node1, node2, explicacion = '') {
    this.edges.addEdge(node1, node2, explicacion);
    this.physics.addSpring(new VerletSpring2D(node1, node2, 100, 0.01));
    this.updateGraph();
  }

  removeEdgesConnectedToNode(node) {
    this.edges.removeEdgesConnectedToNode(node);
    this.updateGraph();
  }

  removeEdge(edge) {
    this.edges.edgesList = this.edges.edgesList.filter(e => e !== edge);
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

  rebuildGraph(graph) {
    this.nodos.clear(); // Limpia los nodos existentes
    let nodeMap = {};
    for (let node of graph.nodes) {
      let newNode = this.nodos.addNode(random(width), random(height));
      newNode.label = node.id;
      newNode.year = node.year; // Asignar el año al nodo 
      nodeMap[node.id] = newNode;
    }

    this.edges = new Edges();
    graph.links.forEach(link => {
      let source = nodeMap[link.source];
      let target = nodeMap[link.target];
      if (source && target) {
        this.addEdge(source, target, link.explicacion);
      }
    });

    this.updateGraph();
  }

  drawEdges() {
    this.edges.edgesList.forEach(edge => {
      if (edge.visible) {
          edge.draw();
      }
    });
  }

  setAnimationMode(mode, year) {
    this.animationMode = mode;
    this.currentYear = year;
    if (mode) {
        this.nodos.setAllNodesInvisible();
    } else {
        this.nodos.setAllNodesVisible();
    }
    this.updateGraph();
  }

  getUniqueSortedYears() {
    // Recopilar todos los años de los nodos
    let years = this.nodos.nodes.map(node => node.year);
    // Eliminar duplicados y ordenar de menor a mayor
    let uniqueYears = [...new Set(years)].sort((a, b) => a - b);
    return uniqueYears;
  }
}
