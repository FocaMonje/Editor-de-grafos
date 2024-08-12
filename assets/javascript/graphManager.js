
class GraphManager {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
  
    this.graphJSONObject = {};
    this.prepareJSONObject();
    this.nodesUnderMouse = [];
    this.edgesUnderMouse = [];
    
  }

  prepareJSONObject() {
    this.graphJSONObject = {
      directed: true,
      graph: {},
      nodes: this.nodes.nodesList.map(node => ({ id: node.label, year: node.year , valencia: node.valencia })),    // Guardar el año en el nodo
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

  rebuildGraph(graph) {
    this.nodes.clear(); // Limpia los nodos existentes
    let nodeMap = {};
    for (let node of graph.nodes) {
      if(node.id === undefined || node.year === undefined){
        continue;
      }
      let label = node.id;
      let year = node.year; // Asignar el año al nodo 
      
      let newNode = this.nodes.addNode(year, label);
      
      nodeMap[node.id] = newNode;
    }
    
    this.edges = new Edges(); // Limpia los arcos existentes
    graph.links.forEach(link => {
    let source = nodeMap[link.source];
    let target = nodeMap[link.target];
    if (source && target) {
      this.addEdge(source, target, link.explicacion);
      source.valencia++;
    }
    });
    
    this.prepareJSONObject();
    }


  addEdge(node1, node2, explicacion = '') {
    this.edges.addEdge(node1, node2, explicacion);
  }

  removeEdgesConnectedToNode(node) {
    this.edges.removeEdgesConnectedToNode(node);
  }

  removeEdge(edge) {
    this.edges.edgesList = grafoNuevo.edges.edgesList.filter(e => e !== edge);
  }

  drawGraph(){
    this.drawEdges();
    this.drawNodes();

    if (state.mode == "editorMode"){
      draw_grid(width, height, 75);
    }

    if (state.mode == "animationMode"){
      draw_grid(width, height, genAlpha.next().value);
    }
    
  }

  drawEdges() {

    let listaArcos = [];

    if (state.mode == "timeLineMode"){
     listaArcos = state.gameEdges;
    }
    if (state.mode == "editorMode"){
      listaArcos = this.edges.edgesList;
    }
    if (state.mode == "animationMode"){
      listaArcos = [];
    }

    listaArcos.forEach(edge => {
      if (edge.visible) {
          edge.draw();
      }
    });
  }

  drawNodes(size=10){
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

  findEdgeUnderMouse() {
    let coordenadas = coordCanvasReales(mouseX, mouseY);
    let x = coordenadas.x;
    let y = coordenadas.y;
    
    for (let edge of this.edges.edgesList) {
      if (edge.isMouseOver(x, y)) {
        this.edgesUnderMouse = edge.explicacion;
        // console.log("Flechas bajo el ratón : " + this.edgesUnderMouse);
        return edge;
      }
    }
    this.edgesUnderMouse = [];
    // console.log("Flechas vacias bajo el ratón : " + this.edgesUnderMouse);
    return null;
  }

}




