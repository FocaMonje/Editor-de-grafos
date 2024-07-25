
class GraphManager {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
  
    this.graphJSONObject = {};
    //this.prepareJSONObject();
    
  }

  prepareJSONObject() {
    this.graphJSONObject = {
      directed: true,
      graph: {},
      nodes: this.nodes.nodesList.map(node => ({ id: node.label, year: node.year })),    // Guardar el año en el nodo
      links: this.edges.edgesList.map(edge => ({
        source: edge.source.label,
        target: edge.target.label,
        explicacion: edge.explicacion  // Información asociada a la flecha
      })).filter(link => link.source && link.target),
      multigraph: false
    };
  }

 
  saveGraph() {
    this.prepareJSONObject();
    saveJSON(this.graphJSONObject, 'graph.json');
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


  static createNodesEdgesFromJson(graphJson, graph){

    let nodeMap = {};
    for (let node of graphJson.nodes) {
      let label = node.id;
      let year = node.year; // Asignar el año al nodo 
      let size = slider_node_size.value;
      let newNode = graph.nodes.addNode(label, size, year);
      newNode.valencia = 0;
      nodeMap[node.id] = newNode;
    }

    graph.edges = new Edges();
    graphJson.links.forEach(link => {
      let source = nodeMap[link.source];
      let target = nodeMap[link.target];
      if (source && target) {
        graph._addEdge(source, target, link.explicacion);
        source.valencia++;
      }
    });
  }


  static copyGraph(grafo){

    let graph = grafo.graphJSONObject;

    let graphNodes = new Nodes();
    let copyOfGraph = new GraphManager(graphNodes);

    GraphManager.createNodesEdgesFromJson(graph, copyOfGraph);
    copyOfGraph.prepareJSONObject();

    return copyOfGraph;
  }


  rebuildGraph(graph) {
    this.nodes.clear(); // Limpia los nodos existentes
    
    GraphManager.createNodesEdgesFromJson(graph, this);

    this.prepareJSONObject();


    /* ------------------------------------ */

    /* Codigo de prueba */


    /*-------------------------------------- */
  
    console.log("Grafo original: " , this.nodes.nodesList );
    let grafoNuevo = this.addNode(new Node("nuevo", 10, 1700));
    console.log();
    console.log("Grafo Nuevo: ", grafoNuevo.nodes.nodesList);
    console.log("Grafo original: " , this );

    
  
  }

  _addNode(node){
    let newNode = this.nodes.addNode(node.x,node.y, 10);
    newNode.label = node.label;
    newNode.year = node.year; // Asignar el año al nodo  
    this.prepareJSONObject();
  }

  addNode(node){
    let grafoNuevo = GraphManager.copyGraph(this);
    let newNode = grafoNuevo.nodes.addNode(node.x,node.y, 10);
    newNode.label = node.label;
    newNode.year = node.year; // Asignar el año al nodo  
    grafoNuevo.prepareJSONObject();
    return grafoNuevo;
  }

  _addEdge(node1, node2, explicacion = '') {
    this.edges.addEdge(node1, node2, explicacion);
    this.prepareJSONObject();
  }

  addEdge(node1, node2, explicacion = '') {
    let grafoNuevo = GraphManager.copyGraph(this);
    grafoNuevo.edges.addEdge(node1, node2, explicacion);
    grafoNuevo.prepareJSONObject();
    return grafoNuevo;
  }

  removeEdgesConnectedToNode(node) {
    let grafoNuevo = GraphManager.copyGraph(this);
    grafoNuevo.edges.removeEdgesConnectedToNode(node);
    grafoNuevo.prepareJSONObject();
    return grafoNuevo;
  }

  removeEdge(edge) {
    let grafoNuevo = GraphManager.copyGraph(this);
    grafoNuevo.edges.edgesList = grafoNuevo.edges.edgesList.filter(e => e !== edge);
    grafoNuevo.prepareJSONObject();
    return grafoNuevo;
  }

  syncState(state) {
    this.state = state;
  }



  drawEdges() {
    this.edges.edgesList.forEach(edge => {
      if (edge.visible) {
          edge.draw();
      }
    });
  }

  drawNodes(size){
    this.nodes.nodesList.forEach(node => {
      if (node.visible) {
          node.draw(size);
      }
    });

  }

  setAnimationMode(mode, year) {
    this.animationMode = mode;
    this.currentYear = year;
    if (mode) {
        this.nodes.setAllNodesInvisible();
    } else {
        this.nodes.setAllNodesVisible();
    }
    this.prepareJSONObject();
  }

  getUniqueSortedYears() {
    // Recopilar todos los años de los nodos
    let years = this.nodes.nodesList.map(node => node.year);
    // Eliminar duplicados y ordenar de menor a mayor
    let uniqueYears = [...new Set(years)].sort((a, b) => a - b);
    return uniqueYears;
  }

  findNodesUnderMouse(){
    const coordsReales = coordCanvasReales(mouseX, mouseY);
  
    const toleranciaX = 10;
    const toleranciaY = 0.7;
    
    const inv_filtrados = this.nodes.nodesList.filter(
      (invento) => (abs(invento.year - coordsReales.x)  < toleranciaX)  &&
                    (abs(invento.valencia - coordsReales.y)  < toleranciaY) )
    
    if (inv_filtrados.length > 0){
      
      for (let invento of inv_filtrados ){
        console.log();
        console.log(invento.label);
        console.log(invento.year);
        console.log(invento.valencia);
        console.log();

        return inv_filtrados;
      }
    } else {
      
      console.log();
      console.log("ScrollX:", scrollX);
      console.log("ScrollY:", scrollY);
      console.log("ZoomX:", zoomX);
      console.log("ZoomY:", zoomY);
      console.log("Coord en el Canvas: ", mouseX, mouseY);
      console.log("Coord Reales: ", coordsReales.x,coordsReales.y  );

      return [];
    }
  }
}

