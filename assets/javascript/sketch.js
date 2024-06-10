let nodes = [];
let edges = [];
let selectedNode = null;
let draggingNode = null;
let saveButton, loadButton;

function setup() {
  createCanvas(800, 600);
  
  // Asociar eventos a los botones creados en index.html
  saveButton = select('#saveButton');
  saveButton.mousePressed(saveGraph);

  loadButton = select('#loadButton');
  loadButton.mousePressed(loadGraph);
}

function draw() {
  background(220);
  
  // Dibujar aristas
  stroke(0);
  for (let edge of edges) {
    line(edge[0].x, edge[0].y, edge[1].x, edge[1].y);
  }

  // Dibujar nodos
  stroke(0);
  fill(255); // Color de los nodos a blanco
  for (let node of nodes) {
    ellipse(node.x, node.y, 20, 20);
    fill(0); // Color del texto a negro
    textAlign(CENTER, CENTER);
    text(node.label, node.x, node.y);
    fill(255); // Restaurar el color de relleno a blanco para los siguientes nodos
  }
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    // Eliminar nodos y aristas con clic derecho
    for (let i = nodes.length - 1; i >= 0; i--) {
      let node = nodes[i];
      let d = dist(mouseX, mouseY, node.x, node.y);
      if (d < 10) {
        nodes.splice(i, 1);
        // Eliminar las aristas conectadas a este nodo
        edges = edges.filter(edge => edge[0] !== node && edge[1] !== node);
        return;
      }
    }
  } else {
    // Verificar si se hizo clic en un nodo existente
    for (let node of nodes) {
      let d = dist(mouseX, mouseY, node.x, node.y);
      if (d < 10) {
        if (selectedNode === null) {
          selectedNode = node;
        } else {
          // Crear una arista entre los dos nodos seleccionados
          edges.push([selectedNode, node]);
          selectedNode = null;
        }
        return;
      }
    }

    // Si no se hizo clic en un nodo existente, crear un nuevo nodo
    let newNode = { x: mouseX, y: mouseY, label: nodes.length.toString() };
    nodes.push(newNode);
    selectedNode = null;
  }
}

function mouseDragged() {
  // Mover nodos arrastrándolos
  if (draggingNode) {
    draggingNode.x = mouseX;
    draggingNode.y = mouseY;
  } else {
    for (let node of nodes) {
      let d = dist(mouseX, mouseY, node.x, node.y);
      if (d < 10) {
        draggingNode = node;
        break;
      }
    }
  }
}

function mouseReleased() {
  draggingNode = null;
}

function saveGraph() {
  // Guardar grafo
  let graph = { nodes: nodes, edges: edges.map(edge => [nodes.indexOf(edge[0]), nodes.indexOf(edge[1])]) };
  saveJSON(graph, 'graph.json');
}

function loadGraph() {
  // Cargar grafo
  let input = createFileInput(handleFile);
  input.hide();
  input.elt.click();
}

function handleFile(file) {
  if (file.type === 'application' && file.subtype === 'json') {
    let graph = JSON.parse(file.data);
    nodes = graph.nodes;
    edges = graph.edges.map(edge => [nodes[edge[0]], nodes[edge[1]]]);
  }
}