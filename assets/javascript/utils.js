
function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
        let mouseXAdj = (mouseX - centerX - controls.view.x) / zoomFactor + centerX;
        let mouseYAdj = (mouseY - centerY - controls.view.y) / zoomFactor + centerY;

        switch (workMode) {
        
            case 'gameMode':{

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
                             score_points += 1 ;
                             addEdgeToFinalPath(nodes.nodeSelected, node); // Añadir arista propuesta
                         }
                         else {
                            score_points -= 1 ;
                         }
                         nodes.unSelectNodes();
                         console.log(score_points);
                     } else if (nodes.nodeSelected === null && node.selected === false) {
                         nodes.selectNode(node);
                         labelInput.value(node.label);
                     } } else if (nodes.nodeSelected != null) {
                        nodes.unSelectNodes();
                    }
                break;
            }

            case 'gameMode2': {
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
                            score_points += 1;
                            addEdgeToFinalPath(nodes.nodeSelected, node); // Añadir arista propuesta
                        } else {
                            score_points -= 1;
                        }
                        nodes.unSelectNodes();
                        console.log(score_points);
                    } else if (nodes.nodeSelected === null && node.selected === false) {
                        nodes.selectNode(node);
                        labelInput.value(node.label);
                    }
                } else if (nodes.nodeSelected != null) {
                    nodes.unSelectNodes();
                }
                break;
            }

            case 'drawMode': {
                // Verificar si se ha hecho clic en una flecha
                let edge = graphManager.edges.findEdge(mouseXAdj, mouseYAdj);
                if (edge) {
                    // Si la flecha ya está seleccionada, se deselecciona
                    if (graphManager.edges.selectedEdge === edge) {
                        graphManager.edges.unselectEdges();
                        edgeInput.value('');
                    } else {
                        // Si se ha hecho clic en una flecha, se maneja como en 'selectedMode'
                        graphManager.edges.selectEdge(edge);
                        edgeInput.value(edge.explicacion);
                    }
                    break;
                }

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
            case 'animationMode': {
                startAnimation();
                break;
            }

            case 'timeLineMode': {
                let node = nodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
                if (node) {
                    if (nodes.nodeSelected !== null && nodes.nodeSelected !== node) {
                        // Verificar si la dirección es correcta según el año
                        let correctDirection = node.year > nodes.nodeSelected.year;
                        if (correctDirection) {
                            // Agregar la arista y hacerla visible
                            graphManager.edges.addEdge(nodes.nodeSelected, node);
                            score_points += 1;
                            addEdgeToFinalPath(nodes.nodeSelected, node); // Añadir arista propuesta
                        } else {
                            score_points -= 1;
                        }
                        nodes.unSelectNodes();
                        console.log(score_points);
                    } else if (nodes.nodeSelected === null && node.selected === false) {
                        nodes.selectNode(node);
                        labelInput.value(node.label);
                    }
                } else if (nodes.nodeSelected != null) {
                    nodes.unSelectNodes();
                }
                break;
            }
            
        }
    }
}

function mouseDragged() {
  let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
  let mouseXAdj = (mouseX - centerX - controls.view.x) / zoomFactor + centerX;
  let mouseYAdj = (mouseY - centerY - controls.view.y) / zoomFactor + centerY;

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

function resetButtonStyles() {
    drawModeButton.style('background-color', '');
    deleteModeButton.style('background-color', '');
    // selectedModeButton.style('background-color', '');
    animationModeButton.style('background-color', '');
    gameModeButton.style('background-color', '');
    hideAnimationControls();
}

function moveView(deltaX, deltaY) {
    controls.view.x += deltaX;
    controls.view.y += deltaY;
    // Ajustar las coordenadas de los nodos y aristas según el movimiento
    nodes.nodesList.forEach(node => {
        node.x += deltaX;
        node.y += deltaY;
    });
    graphManager.updateGraph(); // Actualizar el grafo
}

function modifyEdgeInfo(){
    let edge = graphManager.edges.selectedEdge;
    if (edge) {
        edge.explicacion = edgeInput.value();
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
