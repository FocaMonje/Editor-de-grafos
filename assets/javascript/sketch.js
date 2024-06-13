let nodes = new Nodos();
let edges = [];
let selectedNode = null;
let draggingNode = null;
let saveButton, loadButton;
let gui;
let zoomSettings = { zoom: 35 }; 
let centerX, centerY;
let drawMode = true;

function setup() {
  createCanvas(800, 600);

  saveButton = select('#saveButton');
  saveButton.mousePressed(() => saveGraph(nodes, edges));

  loadButton = select('#loadButton');
  loadButton.mousePressed(() => loadGraph(graph => {
    nodes = new Nodos();
    for (let node of graph.nodes) {
      nodes.addNode(random(width), random(height));
    }
    edges = graph.links.map(link => [
      nodes.nodes[parseInt(link.source.substring(1)) - 1],
      nodes.nodes[parseInt(link.target.substring(1)) - 1]
    ]);
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
  for (let edge of edges) {
    line(edge[0].x, edge[0].y, edge[1].x, edge[1].y);
  }

  fill(255);
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
        if (selectedNode === null) {
          selectedNode = node;
        } else {
          edges.push([selectedNode, node]);
          selectedNode = null;
        }
      } else {
        selectedNode = nodes.addNode(mouseXAdj, mouseYAdj);
      }
    } else {
      let node = nodes.findNode(mouseXAdj, mouseYAdj);
      if (node) {
        nodes.removeNode(node);
        edges = edges.filter(edge => edge[0] !== node && edge[1] !== node);
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