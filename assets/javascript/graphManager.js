class GraphManager {
  constructor(nodos) {
    this.nodos = nodos;
    this.edges = [];
    this.updateGraph();  // Inicializar el grafo correctamente
  }

  updateGraph() {
    console.log("Updating graph");
    this.graph = {
      directed: true,
      graph: {},
      nodes: this.nodos.nodes.map(node => ({ id: node.label })),  // Usa node.label como id
      links: this.edges.map(edge => ({
        source: edge[0].label,
        target: edge[1].label
      })),
      multigraph: false
    };
    console.log(this.graph);  // Depuración: imprimir el grafo actualizado
  }

  addEdge(node1, node2) {
    console.log(`Adding edge between ${node1.label} and ${node2.label}`);
    this.edges.push([node1, node2]);
    this.updateGraph(); //Actualizar grafo después de añadir una arista
  }

  removeEdgesConnectedToNode(node) {
    console.log(`Removing edges connected to node ${node.label}`);
    this.edges = this.edges.filter(edge => edge[0] !== node && edge[1] !== node);
    this.updateGraph(); // Actualizar grafo después de eliminar aristas
  }

  saveGraph() {
    this.updateGraph(); // Actualizar grafo antes de guardar
    console.log("Saving graph:", this.graph);  // Depuración: imprimir el grafo que se va a guardar
    saveJSON(this.graph, 'graph.json');
  }

  loadGraph(callback) {
    let input = createFileInput(file => this.handleFile(file, callback));
    input.hide();
    input.elt.click();
  }

  handleFile(fileArray, callback) {
    let file = fileArray[0]; // Tomar el primer archivo del array
    let reader = new FileReader();
    reader.onload = event => {
      try {
        let graph = JSON.parse(event.target.result);
        callback(graph);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file); // Leer el archivo como texto
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
  