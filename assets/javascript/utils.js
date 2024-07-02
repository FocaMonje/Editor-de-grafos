var colors = ['#008080', '#ADD8E6', '#61B2CB', '#2EA2D1'];

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

            case 'drawMode': {
             
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
                    // }
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
            if (edge != null) {
                graphManager.edges.selectEdge(edge);
                edgeInput.value(edge.explicacion);
            } else {
                  try {
                      graphManager.edges.unselectEdges();
                  } catch (e) {
                      console.log(e);
                  }             
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
    selectedModeButton.style('background-color', '');
    animationModeButton.style('background-color', '');
    gameModeButton.style('background-color', '');
    hideAnimationControls();
}

// function drawArrow(x1, y1, x2, y2) {
//     let arrowSize = 10; // Tamaño de la punta de la flecha
//     let arrowLength = dist(x1, y1, x2, y2) - arrowSize * 2; // Longitud del cuerpo de la flecha
//     arrowLength /= 1.1; // Reducimos el tamaño del cuerpo de la flecha
//     let arrowAngle = atan2(y2 - y1, x2 - x1); // Para orientar la flecha en la dirección adecuada
//     push();
//     translate(x1, y1);
//     rotate(arrowAngle);
//     // Dibujar el cuerpo de la flecha
//     line(0, 0, arrowLength, 0);
//     // Dibujar la punta de la flecha
//     translate(arrowLength, 0);
//     triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
//     pop();
// }

function enterGameMode() {
    workMode = "gameMode";
    const button = document.getElementById('gameModeButton');
    button.textContent = 'Exit Game Mode'; // Cambiar texto del botón
    // Ocultar los controles y deshabilitar la creación de nodos
    slider_node_size.attribute('disabled', true);
    labelInput.attribute('disabled', true);

    // Ocultar las flechas (edges)
    graphManager.edges.edges.forEach(edge => {
        edge.visible = false;
    });
    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');
    // Iniciar el cronómetro
    countdown = 30; // Reiniciar el tiempo del cronómetro
    timer.html('Tiempo: ' + countdown); // Mostrar el tiempo inicial
    timer.style('display', 'block');
    countdownInterval = setInterval(() => {
        countdown--;
        timer.html('Tiempo: ' + countdown);
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000);
}

function exitGameMode() {
    workMode = "drawMode";
    const button = document.getElementById('gameModeButton');
    button.textContent = 'Game Mode'; // Restaurar texto original del botón
    hideScore();
    // Mostrar los controles y habilitar la creación de nodos
    slider_node_size.removeAttribute('disabled');
    labelInput.removeAttribute('disabled');

    // Restaurar la visibilidad de las flechas (edges) según la lógica del juego
    graphManager.edges.edges.forEach(edge => {
        edge.visible = true; // Implementar la lógica de visibilidad según el juego
    });

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');
   // Detener el cronómetro
   clearInterval(countdownInterval); // Detener el cronómetro
   timer.html('Tiempo: 30'); // Resetear el tiempo mostrado
    timer.style('display', 'none'); // Ocultar el temporizador
}

function checkGameCompletion() {
    // Verificar si todas las flechas están visibles
    let allEdgesVisible = graphManager.edges.edges.every(edge => edge.visible);

    // Si todas las flechas están visibles, mostrar la ventana de fin del juego
    if (allEdgesVisible) {
        endGame();
        gameOverWindow.style('display', 'block');
    }
}

// Función para terminar el juego y evaluar la puntuación
function endGame() {
    clearInterval(countdownInterval); // Detener el cronómetro
    let points = evaluateScorePoints();
    displayScore(points);
}

function evaluateScorePoints(){

     // Asegurarse de que la puntuación no sea negativa
     if (    score_points < 0) {
        score_points = 0;
    }

    console.log("Final Score:", score_points);
    return score_points;
}

// Función para evaluar la puntuación
// function evaluateScore() {
//     let score = 0;  // Reiniciar la puntuación
//     let realEdges = getRealEdges();  // Obtener flechas reales del grafo
//     let playerEdges = getPlayerEdges();  // Obtener flechas propuestas por el jugador
    
//     console.log("Real Edges:", JSON.stringify(realEdges, null, 2));
//     console.log("Player Edges:", JSON.stringify(playerEdges, null, 2));

//     // Verificar cada arista propuesta por el jugador
//     playerEdges.forEach(playerEdge => {
//         let foundMatch = realEdges.some(realEdge => areEdgesEqual(realEdge, playerEdge));
//         console.log(`Player Edge: ${JSON.stringify(playerEdge.from)} -> ${JSON.stringify(playerEdge.to)}, Match Found: ${foundMatch}`);

//         if (foundMatch) {
//             score += 1;  // Acierto: sumar 1 punto
//         } else {
//             score -= 0.2;  // Error: restar 0.2 puntos
//         }
//     });

//     // Asegurarse de que la puntuación no sea negativa
//     if (score < 0) {
//         score = 0;
//     }

//     console.log("Final Score:", score);
//     return score;
// }


// Función para mostrar la puntuación
function displayScore(points) {
    scoreDisplay.html(`Puntuación: ${points}`); // Mostrar la puntuación en el elemento HTML correspondiente
    scoreDisplay.style('display', 'block'); // Asegurarse de que el elemento sea visible
}

function hideScore() {
    scoreDisplay.style('display', 'none');
}

// Función para obtener las flechas reales
function getRealEdges() {
    let edgesList = [];
    for (let from in edges) {
        if (edges.hasOwnProperty(from)) {
            let coords = from.split(',');
            let fromX = parseFloat(coords[0]);
            let fromY = parseFloat(coords[1]);

            edges[from].forEach(to => {
                edgesList.push({
                    from: { x: fromX, y: fromY },
                    to: { x: to.x, y: to.y }
                });
            });
        }
    }
    console.log('Real Edges:', JSON.stringify(edgesList, null, 2));
    return edgesList;
}

// Función para obtener las flechas propuestas por el jugador
function getPlayerEdges() {
    let playerEdgesList = [];
    for (let i = 0; i < finalPath.length - 1; i++) {
        playerEdgesList.push({
            from: { x: finalPath[i].x, y: finalPath[i].y },
            to: { x: finalPath[i + 1].x, y: finalPath[i + 1].y }
        });
    }
    console.log('Player Edges:', JSON.stringify(playerEdgesList, null, 2));
    return playerEdgesList;
}

// Función para comparar dos flechas con una tolerancia
function areEdgesEqual(edge1, edge2, delta = 110.1) {
    function arePointsEqual(point1, point2, delta) {
        return Math.abs(point1.x - point2.x) < delta && Math.abs(point1.y - point2.y) < delta;
    }
    
    console.log(`Comparing edges with tolerance: ${JSON.stringify(edge1)} === ${JSON.stringify(edge2)}`);
    
    return arePointsEqual(edge1.from, edge2.from, delta) && arePointsEqual(edge1.to, edge2.to, delta);
}


function moveView(deltaX, deltaY) {
    controls.view.x += deltaX;
    controls.view.y += deltaY;
    // Ajustar las coordenadas de los nodos y aristas según el movimiento
    nodes.nodes.forEach(node => {
        node.x += deltaX;
        node.y += deltaY;
    });
    graphManager.updateGraph(); // Actualizar el grafo
}

function addEdgeToFinalPath(fromNode, toNode) {
    if (!finalPath.some(node => node.x === fromNode.x && node.y === fromNode.y)) {
        finalPath.push(fromNode);
    }
    finalPath.push(toNode);

    // Añadir la arista a la estructura edges
    let fromKey = `${fromNode.x},${fromNode.y}`;
    if (!edges[fromKey]) {
        edges[fromKey] = [];
    }
    edges[fromKey].push(toNode);
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
