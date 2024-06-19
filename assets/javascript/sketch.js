let nodes;
let graphManager;
let draggingNode = null;
let saveButton, loadButton, drawModeButton, deleteModeButton, selectedModeButton;
let zoomSettings = { zoom: 35 };
let centerX, centerY;
let nodeCounter = 1;
<<<<<<< Updated upstream
let workMode = 'drawMode'; 
var label = "id";
=======
let workMode = 'drawMode';
let labelInput;
let selectedEdge = null;
>>>>>>> Stashed changes

function setup() {
    createCanvas(800, 600);

<<<<<<< Updated upstream
  gui = createGui('Settings');
  gui.addObject(zoomSettings, 'zoom', 15, 50);
  gui.setPosition(20, 80);
  /* Crea el panel de visualización de atributos a la derecha del canvas */
  label = createInput('');
  label.position(20, 200);
  // Call modifyNodeName() when input is detected.
  label.input(modifyNodeName);

  let textLabel = createSpan('Node Label');
  textLabel.position(20, 180);

  nodes = new Nodos();
  graphManager = new GraphManager(nodes);
=======
    let slider_zoom = select('#slider_zoom');
    slider_zoom.input(updateZoom);
>>>>>>> Stashed changes

    labelInput = select('#node_label');
    labelInput.input(modifyNodeName);

    labelInput.value(''); // limpiar node label

    nodes = new Nodos();
    graphManager = new GraphManager(nodes);

    saveButton = select('#saveButton');
    saveButton.mousePressed(() => {
        graphManager.saveGraph();
    });

    loadButton = select('#loadButton');
    loadButton.mousePressed(() => {
        graphManager.loadGraph(graph => {
            graphManager.rebuildGraph(graph);
            nodeCounter = Math.max(...graph.nodes.map(node => parseInt(node.id))) + 1;
        });
    });

    drawModeButton = select('#drawModeButton');
    drawModeButton.mousePressed(() => {
        workMode = 'drawMode';
        drawModeButton.style('background-color', '#ddd');
        deleteModeButton.style('background-color', '');
        selectedModeButton.style('background-color', '');
    });

    deleteModeButton = select('#deleteModeButton');
    deleteModeButton.mousePressed(() => {
        workMode = 'deleteMode';
        nodes.unSelectNodes();
        graphManager.edges.unselectEdges();
        deleteModeButton.style('background-color', '#ddd');
        drawModeButton.style('background-color', '');
        selectedModeButton.style('background-color', '');
    });

<<<<<<< Updated upstream
  centerX = width / 2;
  centerY = height / 2;
=======
    selectedModeButton = select('#selectedModeButton');
    selectedModeButton.mousePressed(() => {
        workMode = 'selectedMode';
        selectedModeButton.style('background-color', '#ddd');
        drawModeButton.style('background-color', '');
        deleteModeButton.style('background-color', '');
    });

    centerX = width / 2;
    centerY = height / 2;
>>>>>>> Stashed changes
}

function draw() {
    background(220);

    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
    translate(centerX, centerY);
    scale(zoomFactor);
    translate(-centerX, -centerY);

<<<<<<< Updated upstream
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
=======
    nodes.applyRepulsion();

    stroke(0);
    graphManager.drawEdges();

    nodes.draw();

    if (workMode === 'selectedMode') {
        let edgeInfoDiv = select('#edge-info');
        if (selectedEdge) {
            edgeInfoDiv.html(selectedEdge.explicacion || "No hay información");
            edgeInfoDiv.style('display', 'block');
>>>>>>> Stashed changes
        } else {
            edgeInfoDiv.style('display', 'none');
        }
    }
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
}