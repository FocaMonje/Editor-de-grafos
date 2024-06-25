
function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
        let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
        let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;

      switch (workMode) {
            case 'drawMode': {
                if (gameModeActive) {
                    // Lógica para verificar si el jugador acierta
                    let node = nodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
                    if (node) {
                        if (nodes.nodeSelected !== null && nodes.nodeSelected !== node) {
                            let correctDirection = graphManager.edges.edges.some(edge => {
                                return edge.source === nodes.nodeSelected && edge.target === node;
                            });
                            if (correctDirection) {
                                graphManager.edges.edges.forEach(edge => {
                                    if (edge.source === nodes.nodeSelected && edge.target === node) {
                                        edge.visible = true;
                                    }
                                });
                            }
                            nodes.unSelectNodes();
                        } else if (nodes.nodeSelected === null && node.selected === false) {
                            nodes.selectNode(node);
                            labelInput.value(node.label);
                        }
                    } else if (nodes.nodeSelected != null) {
                        nodes.unSelectNodes();
                    }
                } else {
                    // Lógica normal de creación de flechas
                    let node = nodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
                    if (node) {
                        if (nodes.nodeSelected !== null && nodes.nodeSelected !== node) {
                            graphManager.addEdge(nodes.nodeSelected, node);
                            nodes.unSelectNodes();
                        } else if (nodes.nodeSelected === null && node.selected === false) {
                            nodes.selectNode(node);
                            labelInput.value(node.label);
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
          case 'selectedMode': {
            let edge = graphManager.edges.findEdge(mouseXAdj, mouseYAdj);
            if (edge) {
                selectedEdge = edge;
            } else {
                selectedEdge = null;
            }
            break;
            }

          case 'animationMode': {
            startAnimation();
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

function modifyNodeName() {
  let node = nodes.nodeSelected;
  if (node) {
      node.label = labelInput.value();
  }
}

function updateZoom() {
  let slider_zoom = select('#slider_zoom');
  zoomSettings.zoom = slider_zoom.value();
}

function doZoom(event) {
    const direction = event.deltaY > 0 ? -1 : 1;
    const factor = 0.05;
    const zoom = direction * factor;
  
    const wx = (mouseX - controls.view.x) / (width * controls.view.zoom);
    const wy = (mouseY - controls.view.y) / (height * controls.view.zoom);
  
    controls.view.x -= wx * width * zoom;
    controls.view.y -= wy * height * zoom;
    controls.view.zoom += zoom;
}

function setupYearSliders(graph) {
    let years = graph.nodes.map(node => node.year);
    let minYear = Math.min(...years);
    let maxYear = Math.max(...years);

    minYear = Math.max(minYear, 1000);
    maxYear = Math.min(maxYear, 3000);

    slider_start_year.attribute('min', 1000); 
    slider_start_year.attribute('max', 3000); 
    slider_start_year.value(minYear);

    slider_end_year.attribute('min', 1000); 
    slider_end_year.attribute('max', 3000); 
    slider_end_year.value(maxYear);

    animationSettings.startYear = minYear;
    animationSettings.endYear = maxYear;

    select('#start_year_value').html(minYear);
    select('#end_year_value').html(maxYear);
}


function resetButtonStyles() {
    drawModeButton.style('background-color', '');
    deleteModeButton.style('background-color', '');
    selectedModeButton.style('background-color', '');
    animationModeButton.style('background-color', '');
    hideAnimationControls();
}

function startAnimation() {
    if (workMode === 'animationMode') {
        isAnimating = true;
        if (animationInterval) clearInterval(animationInterval);
        
        let currentYear = animationSettings.startYear;
        let endYear = animationSettings.endYear;
        
        // Iterar a través de los nodos para mostrar solo aquellos en el rango de años seleccionado
        nodes.nodes.forEach(node => {
            node.visible = node.year >= currentYear && node.year <= endYear;
        });

        animationInterval = setInterval(() => {
            graphManager.updateGraph(); // Para actualizar el grafo con los cambios en la visibilidad
            currentYear++;
            if (currentYear > endYear) {
                clearInterval(animationInterval);
                isAnimating = false;
            }
        }, 1000); // Intervalo de 1 segundo (1000 ms) para cada año
    }
}

function animateNodes(currentYear, endYear) {
    nodes.nodes.forEach(node => {
        node.visible = node.year >= currentYear && node.year <= endYear;
    });
    graphManager.updateGraph(); 
}

function showAnimationControls() {
    select('#animation-controls').style('display', 'block');
}

function hideAnimationControls() {
    select('#animation-controls').style('display', 'none');
}

function drawArrow(x1, y1, x2, y2) {
    let arrowSize = 10; // Tamaño de la punta de la flecha
    let arrowLength = dist(x1, y1, x2, y2) - arrowSize * 2; // Longitud del cuerpo de la flecha
    arrowLength /= 1.1; // Reducimos el tamaño del cuerpo de la flecha
    let arrowAngle = atan2(y2 - y1, x2 - x1); // Para orientar la flecha en la dirección adecuada
    push();
    translate(x1, y1);
    rotate(arrowAngle);
    // Dibujar el cuerpo de la flecha
    line(0, 0, arrowLength, 0);
    // Dibujar la punta de la flecha
    translate(arrowLength, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}

function enterGameMode() {
    // Ocultar los controles y deshabilitar la creación de nodos
    slider_node_size.attribute('disabled', true);
    labelInput.attribute('disabled', true);

    // Ocultar las flechas (edges)
    graphManager.edges.edges.forEach(edge => {
        edge.visible = false;
    });

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');
}

function exitGameMode() {
    // Mostrar los controles y habilitar la creación de nodos
    slider_node_size.removeAttribute('disabled');
    labelInput.removeAttribute('disabled');

    // Restaurar la visibilidad de las flechas (edges) según la lógica del juego
    graphManager.edges.edges.forEach(edge => {
        edge.visible = true; // Implementar la lógica de visibilidad según el juego
    });

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');
}

function checkGameCompletion() {
    // Verificar si todas las flechas están visibles
    let allEdgesVisible = graphManager.edges.edges.every(edge => edge.visible);

    // Si todas las flechas están visibles, mostrar la ventana de fin del juego
    if (allEdgesVisible) {
        gameOverWindow.style('display', 'block');
    }
}
