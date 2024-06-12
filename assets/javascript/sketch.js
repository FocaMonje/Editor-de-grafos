let nodes = [];
let edges = [];
let selectedNode = null;
let draggingNode = null;
let saveButton, loadButton;
let gui;
let zoomSettings = { zoom: 35 }; 
let centerX, centerY;
let drawMode = true; // Variable para alternar entre Draw Mode y Delete Mode
let nodeCounter = 0; // Contador global para los nodos

function setup() {
  createCanvas(800, 600);

  // Asociar eventos a los botones creados en index.html
  saveButton = select('#saveButton');
  saveButton.mousePressed(saveGraph);

  loadButton = select('#loadButton');
  loadButton.mousePressed(loadGraph);

  drawModeButton = select('#drawModeButton');
  drawModeButton.mousePressed(() => {
    drawMode = true;
    drawModeButton.style('background-color', '#ddd'); // Cambiar color para indicar modo activo
    deleteModeButton.style('background-color', ''); // Restaurar color del otro botón
  });

  deleteModeButton = select('#deleteModeButton');
  deleteModeButton.mousePressed(() => {
    drawMode = false;
    deleteModeButton.style('background-color', '#ddd'); // Cambiar color para indicar modo activo
    drawModeButton.style('background-color', ''); // Restaurar color del otro botón
  });

  // Crear la barra de zoom
  gui = createGui('Settings');
  gui.addObject(zoomSettings, 'zoom', 15, 50); // Ajuste del rango mínimo y máximo
  gui.setPosition(10, 130);

  centerX = width / 2;
  centerY = height / 2;
}

function applyRepulsion() {
  let repulsionForce = 0.1; // Ajustar valor según la intensidad de repulsión que se desee
  let minDistance = 150; // Distancia mínima permitida entre los nodos

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let nodeA = nodes[i];
      let nodeB = nodes[j];
      let dx = nodeB.x - nodeA.x;
      let dy = nodeB.y - nodeA.y;
      let distance = dist(nodeA.x, nodeA.y, nodeB.x, nodeB.y);

      if (distance < minDistance) {
        let angle = atan2(dy, dx);
        let force = (minDistance - distance) * repulsionForce;
        let fx = cos(angle) * force;
        let fy = sin(angle) * force;

        nodeA.x -= fx / 2;
        nodeA.y -= fy / 2;
        nodeB.x += fx / 2;
        nodeB.y += fy / 2;

        // Asegurarse de que los nodos no se muevan fuera del canvas
        nodeA.x = constrain(nodeA.x, 0, width);
        nodeA.y = constrain(nodeA.y, 0, height);
        nodeB.x = constrain(nodeB.x, 0, width);
        nodeB.y = constrain(nodeB.y, 0, height);
      }
    }
  }
}

function draw() {
  background(220);

  // Ajustar el zoom según el valor del slider
  let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2); // Mapear el valor del zoom al rango deseado
  
  // Translación al centro y aplicar zoom
  translate(centerX, centerY);
  scale(zoomFactor);
  translate(-centerX, -centerY);

  // Aplicar repulsión entre los nodos
  applyRepulsion();

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
  // Verificar si el clic se realizó dentro del área del lienzo
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    // Calcular las coordenadas del ratón ajustadas al desplazamiento y zoom del lienzo
    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2); // Mapear el valor del zoom al rango deseado
    let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
    let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;

    if (drawMode) {
      // Verificar si se hizo clic en un nodo existente
      for (let node of nodes) {
        let d = dist(mouseXAdj, mouseYAdj, node.x, node.y);
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
      let newNode = { x: mouseXAdj, y: mouseYAdj, label: (nodeCounter + 1).toString() };
      nodes.push(newNode);
      selectedNode = newNode;
      nodeCounter++;
    } else {
      // Modo de eliminación
      // Verificar si se hizo clic en un nodo existente
      for (let i = nodes.length - 1; i >= 0; i--) {
        let node = nodes[i];
        let d = dist(mouseXAdj, mouseYAdj, node.x, node.y);
        if (d < 10) {
          // Eliminar el nodo
          nodes.splice(i, 1);
          // Eliminar las aristas conectadas a este nodo
          edges = edges.filter(edge => edge[0] !== node && edge[1] !== node);
          return;
        }
      }
    }
  }
}

function mouseDragged() {
  let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2); // Mapear el valor del zoom al rango deseado
  let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
  let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;

  if (draggingNode) {
    draggingNode.x = mouseXAdj;
    draggingNode.y = mouseYAdj;
  } else {
    for (let node of nodes) {
      let d = dist(mouseXAdj, mouseYAdj, node.x, node.y);
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
  // Guardar grafo con la estructura elegida
  let graph = {
    directed: true,
    graph: {},
    nodes: nodes.map((node, index) => ({ id: `N${index + 1}` })),
    links: edges.map(edge => ({
      source: `N${nodes.indexOf(edge[0]) + 1}`,
      target: `N${nodes.indexOf(edge[1]) + 1}`
    })),
    multigraph: false
  };
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
    try {
      let graph = JSON.parse(file.data);
      nodes = graph.nodes.map((node, index) => ({
        x: random(width),
        y: random(height),
        label: (nodeCounter + index + 1).toString()
      }));
      nodeCounter += graph.nodes.length; // Aumentar el contador de nodos para evitar duplicados
      edges = graph.links.map(link => [
        nodes[parseInt(link.source.substring(1)) - 1],
        nodes[parseInt(link.target.substring(1)) - 1]
      ]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
}