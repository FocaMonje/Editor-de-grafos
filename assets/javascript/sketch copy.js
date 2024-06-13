let nodes;
let graphManager;
let selectedNode = null;
let draggingNode = null;
let saveButton, loadButton, drawModeButton, deleteModeButton;
let gui;
let zoomSettings = { zoom: 35 };
let centerX, centerY;
let drawMode = true;

function setup() {
  createCanvas(800, 600);

  nodes = new Nodos();
  graphManager = new GraphManager(nodes);

  saveButton = select('#saveButton');
  saveButton.mousePressed(() => graphManager.saveGraph());

  loadButton = select('#loadButton');
  loadButton.mousePressed(() => graphManager.loadGraph(graph => {
    nodes = new Nodos();
    graphManager = new GraphManager(nodes);
    for (let node of graph.nodes) {
      nodes.addNode(random(width), random(height));
    }
    graphManager.edges = graph.links.map(link => [
      nodes.nodes[parseInt(link.source.substring(1)) - 1],
      nodes.nodes[parseInt(link.target.substring(1)) - 1]
    ]);
    graphManager.updateGraph();  // Actualizar el grafo después de cargarlo
  }));

  drawModeButton = select('#drawModeButton');
  drawModeButton.mousePressed(() => {
    drawMode = true;
    drawModeButton.style('background-color', '#ddd');
    deleteModeButton.style('background-color', '');
  });

  deleteModeButton = select('#deleteModeButton');
  deleteModeButton.mousePressed(() => {
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
  if (mouseX >= 0 && mouseY <= width && mouseY >= 0 && mouseY <= height) {
    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
    let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
    let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;

    if (drawMode) {
      let node = nodes.findNode(mouseXAdj, mouseYAdj);
      if (node) {
        if (selectedNode === null) {
          selectedNode = node;
        } else {
          graphManager.addEdge(selectedNode, node);
          selectedNode = null;
        }
      } else {
        selectedNode = nodes.addNode(mouseXAdj, mouseYAdj);
        graphManager.updateGraph();  // Actualizar el grafo después de añadir un nodo
      }
    } else {
      let node = nodes.findNode(mouseXAdj, mouseYAdj);
      if (node) {
        nodes.removeNode(node);
        graphManager.removeEdgesConnectedToNode(node);
        graphManager.updateGraph();  // Actualizar el grafo después de eliminar un nodo
      }
    }
  }
}

function mouseDragged() {
  let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
  let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
  let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;

  if (draggingNode) {
    draggingNode.x = mouseXAdj;
    draggingNode.y = mouseYAdj;
  } else {
    draggingNode = nodes.findNode(mouseXAdj, mouseYAdj);
  }
}

function mouseReleased() {
  draggingNode = null;
}