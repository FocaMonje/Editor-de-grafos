let nodes;
let graphManager;
//let selectedNode = null;
let draggingNode = null;
let saveButton, loadButton, drawModeButton, deleteModeButton;
let gui;
let zoomSettings = { zoom: 35 };
let centerX, centerY;
let drawMode = true;
let nodeCounter = 1;

function setup() {
  createCanvas(800, 600);

  nodes = new Nodos();
  graphManager = new GraphManager(nodes);

  saveButton = select('#saveButton');
  saveButton.mousePressed(() => {
    graphManager.saveGraph();
  });

  loadButton = select('#loadButton');
  loadButton.mousePressed(() => graphManager.loadGraph(graph => {
    nodes = new Nodos();
    graphManager = new GraphManager(nodes);

    // Mapa de nodos para mantener posiciones
    let nodeMap = {};
    for (let node of graph.nodes) {
      let newNode = nodes.addNode(random(width), random(height)); 
      newNode.label = node.id;
      nodeMap[node.id] = newNode;
    }
    
    graphManager.edges = graph.links.map(link => [
      nodeMap[link.source],
      nodeMap[link.target]
    ]);
    graphManager.updateGraph();

    // Actualizar nodeCounter para evitar duplicados
    nodeCounter = Math.max(...graph.nodes.map(node => parseInt(node.id))) + 1;
  }));

  drawModeButton = select('#drawModeButton');
  drawModeButton.mousePressed(() => {
    drawMode = true;
    drawModeButton.style('background-color', '#ddd');
    deleteModeButton.style('background-color', '');
  });

  deleteModeButton = select('#deleteModeButton');
  deleteModeButton.mousePressed(() => {
    nodes.unSelectNodes();
    drawMode = false;
    deleteModeButton.style('background-color', '#ddd');
    drawModeButton.style('background-color', '');
  });

  gui = createGui('Settings');
  gui.addObject(zoomSettings, 'zoom', 15, 50);
  gui.setPosition(10, 130);

  centerX = width / 2;
  centerY = height / 2;
}

function draw() {
  background(220);

  let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
  translate(centerX, centerY);
  scale(zoomFactor);
  translate(-centerX, -centerY);

  nodes.applyRepulsion();

  stroke(0);
  graphManager.drawEdges();

  nodes.draw();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
    let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
    let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;

    if (drawMode) {
      let node = nodes.findNode(mouseXAdj, mouseYAdj);

      if (node) {

        if (nodes.nodeSelected !== null && nodes.nodeSelected !== node ) {
          graphManager.addEdge(nodes.nodeSelected, node);
          nodes.unSelectNodes();
        }

        if (nodes.nodeSelected === null &&  node.selected === false) {
          nodes.selectNode(node);
        } 
      } 
      else if (nodes.nodeSelected != null) {
        
        nodes.unSelectNodes();
      
      } else {
        let newNode = nodes.addNode(mouseXAdj, mouseYAdj);
        newNode.label = nodeCounter.toString();
        nodeCounter++;
        }
        
    } 
    else {
      let node = nodes.findNode(mouseXAdj, mouseYAdj);
      if (node) {
        nodes.removeNode(node);
        graphManager.removeEdgesConnectedToNode(node);
      }
    }
    graphManager.updateGraph();
  }
}

function mouseDragged() {
  let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
  let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
  let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;

  if (draggingNode) {
    draggingNode.x = mouseXAdj;
    draggingNode.y = mouseYAdj;
    graphManager.updateGraph();
  } else {
    draggingNode = nodes.findNode(mouseXAdj, mouseYAdj);
  }
}

function mouseReleased() {
  draggingNode = null;
}