
function mousePressed() {
    const coordsReales = coordCanvasReales(mouseX, mouseY);
  
    const toleranciaX = 10;
    const toleranciaY = 0.7;
    
    const inv_filtrados = inventos.filter(
      (invento) => (abs(invento.year - coordsReales.x)  < toleranciaX)  &&
                    (abs(invento.valencia - coordsReales.y)  < toleranciaY) )
    
    if (inv_filtrados.length > 0){
      
      for (let invento of inv_filtrados ){
        console.log();
        console.log(invento.id);
        console.log(invento.year);
        console.log(invento.valencia);
        console.log();
      }
    } else {
      
    console.log();
    console.log("ScrollX:", scrollX);
    console.log("ScrollY:", scrollY);
    console.log("ZoomX:", zoomX);
    console.log("ZoomY:", zoomY);
    console.log("Coord en el Canvas: ", mouseX, mouseY);
    console.log("Coord Reales: ", coordsReales.x,coordsReales.y  );
       
    }

    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
        let mouseXAdj = (mouseX - centerX - controls.view.x) / zoomFactor + centerX;
        let mouseYAdj = (mouseY - centerY - controls.view.y) / zoomFactor + centerY;

        switch (workMode) {
        
            case 'gameMode':{

                 // Lógica para verificar si el jugador acierta
                 let node = activeNodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
                 if (node) {
                     if (activeNodes.nodeSelected !== null && activeNodes.nodeSelected !== node) {
                         let correctDirection = activeGraph.edges.edgesList.some(edge => {
                             return edge.source === activeNodes.nodeSelected && edge.target === node;
                         });
                         if (correctDirection) {
                             activeGraph.edges.edgesList.forEach(edge => {
                                 if (edge.source === activeNodes.nodeSelected && edge.target === node) {
                                     edge.visible = true;
                                 }
                             });
                             score_points += 1 ;
                             addEdgeToFinalPath(activeNodes.nodeSelected, node); // Añadir arista propuesta
                         }
                         else {
                            score_points -= 1 ;
                         }
                         activeNodes.unSelectNodes();
                         console.log(score_points);
                     } else if (activeNodes.nodeSelected === null && node.selected === false) {
                         activeNodes.selectNode(node);
                         labelInput.value(node.label);
                     } } else if (activeNodes.nodeSelected != null) {
                        activeNodes.unSelectNodes();
                    }
                break;
            }

            case 'gameMode2': {
                let node = activeNodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
                if (node) {
                    if (activeNodes.nodeSelected !== null && activeNodes.nodeSelected !== node) {
                        let correctDirection = activeGraph.edges.edgesList.some(edge => {
                            return edge.source === activeNodes.nodeSelected && edge.target === node;
                        });
                        if (correctDirection) {
                            activeGraph.edges.edgesList.forEach(edge => {
                                if (edge.source === activeNodes.nodeSelected && edge.target === node) {
                                    edge.visible = true;
                                }
                            });
                            score_points += 1;
                            addEdgeToFinalPath(activeNodes.nodeSelected, node); // Añadir arista propuesta
                        } else {
                            score_points -= 1;
                        }
                        activeNodes.unSelectNodes();
                        console.log(score_points);
                    } else if (activeNodes.nodeSelected === null && node.selected === false) {
                        activeNodes.selectNode(node);
                        labelInput.value(node.label);
                    }
                } else if (activeNodes.nodeSelected != null) {
                    activeNodes.unSelectNodes();
                }
                break;
            }

            case 'drawMode': {
                // Verificar si se ha hecho clic en una flecha
                let edge = activeGraph.edges.findEdge(mouseXAdj, mouseYAdj);
                if (edge) {
                    // Si la flecha ya está seleccionada, se deselecciona
                    if (activeGraph.edges.selectedEdge === edge) {
                        activeGraph.edges.unselectEdges();
                        edgeInput.value('');
                    } else {
                        // Si se ha hecho clic en una flecha, se maneja como en 'selectedMode'
                        activeGraph.edges.selectEdge(edge);
                        edgeInput.value(edge.explicacion);
                    }
                    break;
                }

                // Lógica normal de creación de flechas
                let node = activeNodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
                if (node) {
                    if (activeNodes.nodeSelected !== null && activeNodes.nodeSelected !== node) {
                        activeGraph.addEdge(activeNodes.nodeSelected, node);
                        activeNodes.unSelectNodes();
                    } else if (activeNodes.nodeSelected === null && node.selected === false) {
                        activeNodes.selectNode(node);
                        labelInput.value(node.label);
                    }
                } else if (activeNodes.nodeSelected != null) {
                    activeNodes.unSelectNodes();
                } else {
                    let edge = activeGraph.edges.findEdge(mouseXAdj, mouseYAdj);
                    if (!edge) {
                        let newNode = activeNodes.addNode(mouseXAdj, mouseYAdj);
                        newNode.label = nodeCounter.toString();
                        nodeCounter++;
                    }
                }
                break;
            }
            case 'deleteMode': {
                let edge = activeGraph.edges.findEdge(mouseXAdj, mouseYAdj);
                if (edge) {
                    activeGraph.edges.removeEdge(edge);
                    return;
                }

                let node = activeNodes.findNode(mouseXAdj, mouseYAdj);
                if (node) {
                    activeNodes.removeNode(node);
                    activeGraph.removeEdgesConnectedToNode(node);
                }
                break;
            }
            case 'animationMode': {
                startAnimation();
                break;
            }

            case 'timeLineMode': {
                let node = activeNodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
                if (node) {
                    if (activeNodes.masterNodeselected !== null && activeNodes.nodeSelected !== node) {
                        // Verificar si la dirección es correcta según el año
                        let correctDirection = node.year > activeNodes.nodeSelected.year;
                        if (correctDirection) {
                            // Agregar la arista y hacerla visible
                            activeGraph.edges.addEdge(activeNodes.nodeSelected, node);
                            score_points += 1;
                            addEdgeToFinalPath(activeNodes.nodeSelected, node); // Añadir arista propuesta
                        } else {
                            score_points -= 1;
                        }
                        activeNodes.unSelectNodes();
                        console.log(score_points);
                    } else if (activeNodes.nodeSelected === null && node.selected === false) {
                        activeNodes.selectNode(node);
                        labelInput.value(node.label);
                    }
                } else if (activeNodes.activeNodeselected != null) {
                    activeNodes.unSelectactiveNodes();
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
      activeGraph.prepareJSONObject();
  } else {
      draggingNode = activeNodes.findNode(mouseXAdj, mouseYAdj);
  }
}

function mouseReleased() {
  draggingNode = null;
}

function modifyNodeName() {
  let node = activeNodes.nodeSelected;
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
    // controls.view.x += deltaX;
    // controls.view.y += deltaY;
    // Ajustar las coordenadas de los nodos y aristas según el movimiento
    // activeNodes.nodesList.forEach(node => {
    //     node.x += deltaX;
    //     node.y += deltaY;
    // });
    // Actualizar el desplazamiento para el canvas
    scrollX -= deltaX;
    scrollY -= deltaY;

    // Ajustar la vista del canvas
    translate(deltaX, deltaY);
    
    // Redibujar el canvas
    redraw();
    
    // activeGraph.prepareJSONObject(); // Actualizar el grafo
}

function modifyEdgeInfo(){
    let edge = activeGraph.edges.selectedEdge;
    if (edge) {
        edge.explicacion = edgeInput.value();
    }
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function centerCanvas(cnv) {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function draw_grid(w, h){
    const alturaDibujo = height - 100;
    
    push();
    for (let i = initYear; i < lastYear; i += 100){
      stroke(0,150,150);
      line(i, 0, i, h);
      textSize(22);
      text(str(i), i + 5, h);
    }
    
    let cont = 0;
    for (let i = alturaDibujo; i > 0; i -= Math.floor(alturaDibujo / maxVal)){
      stroke(0,150,150);
      line(initYear,i, initYear + lastYear, i);
      textSize(22);
      text(str(maxVal - cont), initYear+ 30, alturaDibujo - i);
      cont += 1;
    }
    
    pop();
   
}

function indiceDeInvento(invento_id, arrayInventos){
    
    for (let i = 0; i < arrayInventos.length; i += 1){
      if(invento_id === arrayInventos[i].id)
        return i;
    }
    return -1;
    
}

  
function coordCanvasReales(canvasX, canvasY){
  
    const alturaDibujo = height - 100;
    
    const realX = (canvasX - scrollX) * 1/zoomX ;
    let realY = (canvasY - scrollY) * 1/zoomY;
    
    realY = 2 * (alturaDibujo - realY) / maxVal;
    
    return {x:realX, y:realY};
    
}


// Función para manejar las teclas presionadas
function keyPressed() {
    switch (key) {
      case 'q':
        zoomX = 1;
        zoomY = 1;
        scrollX = -1 * initYear;
        scrollY = 0;
        break;
      case 'z':
        zoomX -= 0.05;
        scrollX += 75;
        break;
      case 'x':
        zoomX += 0.05;
        scrollX -= 75;
        break;
      case 'd':
        zoomY += 0.05;
        break;
      case 'c':
        zoomY -= 0.05;
        break;
    }
}
  