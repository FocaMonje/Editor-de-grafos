let nodes;
let graphManager;
let draggingNode = null;
let saveButton, loadButton, drawModeButton, deleteModeButton;
let gui;
let zoomSettings = { zoom: 35 };
let centerX, centerY;
let nodeCounter = 1;
let workMode = 'drawMode'; 
var label = "id";

function setup() {
  createCanvas(800, 600);

  gui = createGui('Settings');
  gui.addObject(zoomSettings, 'zoom', 15, 50);
  gui.setPosition(20, 80);

  let zoom_Label = createSpan('zoom');
  zoom_Label.parent('div-derecha');
  slider_zoom = createSlider(0, 100);
  slider_zoom.parent('div-derecha');
  /* Crea el panel de visualización de atributos a la derecha del canvas */
  label = createInput('');
  label.parent('div-derecha');
  //label.position(20, 200);
  // Call modifyNodeName() when input is detected.
  label.input(modifyNodeName);

  let textLabel = createSpan('Node Label');
  textLabel.parent('div-derecha');

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

    let nodeMap = {};
    for (let node of graph.nodes) {
      let newNode = nodes.addNode(random(width), random(height));
      newNode.label = node.id;
      nodeMap[node.id] = newNode;
    }

    graphManager.edges = new Edges();
    graph.links.forEach(link => {
      let source = nodeMap[link.source];
      let target = nodeMap[link.target];
      if (source && target) {
        graphManager.addEdge(source, target, link.explicacion);
      }
    });

    graphManager.updateGraph();
    nodeCounter = Math.max(...graph.nodes.map(node => parseInt(node.id))) + 1;
  }));

  drawModeButton = select('#drawModeButton');
  drawModeButton.mousePressed(() => {
    workMode = 'drawMode';
    drawModeButton.style('background-color', '#ddd');
    deleteModeButton.style('background-color', '');
  });

  deleteModeButton = select('#deleteModeButton');
  deleteModeButton.mousePressed(() => {
    workMode = 'deleteMode';
    nodes.unSelectNodes();
    graphManager.edges.unselectEdges();
    deleteModeButton.style('background-color', '#ddd');
    drawModeButton.style('background-color', '');
  });

  centerX = width / 2;
  centerY = height / 2;
}

function draw() {
  background(220);

  // Hay que cambiar zoomSettings por slider_zoom.value()
  // let zoomFactor = map(slider_zoom.value(), 0, 100, 0, 2);
  let zoomFactor = map(zoomSettings.zoom, 0, 100, 0.5, 2);
  translate(centerX, centerY);
  scale(zoomFactor);
  translate(-centerX, -centerY);

  nodes.applyRepulsion();

  stroke(0);
  graphManager.drawEdges();

  nodes.draw();

  // Mostrar información de la flecha si el ratón está sobre ella
  let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
  let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;
  let edge = graphManager.edges.findEdge(mouseXAdj, mouseYAdj);

  let edgeInfoDiv = select('#edge-info');
  if (edge) {
    edgeInfoDiv.html(edge.explicacion || "No hay información");
    edgeInfoDiv.position(mouseX + 15, mouseY + 15);
    edgeInfoDiv.style('display', 'block');
  } else {
    edgeInfoDiv.style('display', 'none');
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
    let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
    let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;

    switch (workMode) {
      case 'drawMode': {
        let node = nodes.findNode(mouseXAdj, mouseYAdj);
        if (node) {
          if (nodes.nodeSelected !== null && nodes.nodeSelected !== node) {
            graphManager.addEdge(nodes.nodeSelected, node); // No se pide info
            nodes.unSelectNodes();
          } else if (nodes.nodeSelected === null && node.selected === false) {
            nodes.selectNode(node);
            label.value(node.label);
          }
        } else if (nodes.nodeSelected != null) {
          nodes.unSelectNodes();
        } else {
          let edge = graphManager.edges.findEdge(mouseXAdj, mouseYAdj);
          if (!edge) {
            let newNode = nodes.addNode(mouseXAdj, mouseYAdj);
            newNode.label = nodeCounter.toString();
            nodeCounter++;
          }
        }
        break;
      }
      case 'deleteMode': {
        let edge = graphManager.edges.findEdge(mouseXAdj, mouseYAdj);
        if (edge) {
          graphManager.edges.removeEdge(edge);
          return;
        }

        let node = nodes.findNode(mouseXAdj, mouseYAdj);
        if (node) {
          nodes.removeNode(node);
          graphManager.removeEdgesConnectedToNode(node);
        }
        break;
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
    graphManager.updateGraph();
  } else {
    draggingNode = nodes.findNode(mouseXAdj, mouseYAdj);
  }
}

function mouseReleased() {
  draggingNode = null;
}

function modifyNodeName(){
  node = nodes.nodeSelected;
  if (node) {
    node.label = label.value();
  }
}