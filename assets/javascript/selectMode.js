function selectMode() {
    const coordsReales = coordCanvasReales(mouseX, mouseY);
  
    const toleranciaX = 10;
    const toleranciaY = 0.7;
    
    const inv_filtrados = activeGraph.nodes.nodesList.filter(
      (invento) => (abs(invento.year - coordsReales.x)  < toleranciaX)  &&
                    (abs(invento.valencia - coordsReales.y)  < toleranciaY) )
    
    if (inv_filtrados.length > 0){
      
      for (let invento of inv_filtrados ){
        console.log();
        console.log(invento.label);
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
       
        let coordenadas = coordCanvasReales(mouseX, mouseY);
        let mouseXAdj = coordenadas.x;
        let mouseYAdj = coordenadas.y;

        switch (workMode) {
        
            case 'gameMode':{

                 // Lógica para verificar si el jugador acierta
                 //let node = activeNodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
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
                //let node = activeNodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
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
                console.log("Soy Draw Mode");
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
                let node = activeNodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomX);
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
                        let label = nodeCounter.toString();
                        let size = slider_node_size.value();
                        let year = coordenadas.x;
                        console.log(year);
                        let newNode = activeNodes.addNode(label, size, year);
                        
                        nodeCounter++;
                        console.log("Soy un nodo");
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
                //let node = activeNodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
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