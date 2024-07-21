function executeByMode() {
    
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {

        let node = null;

        let listaDeNodos = activeGraph.findNodesUnderMouse();
        let edge = activeGraph.edges.findEdgeUnderMouse();
        
        if(listaDeNodos == []) {
            // Deseleccionar cualquier nodo seleccionado
            activeGraph.nodes.unSelectNodes();
            document.getElementById('node_label').value = '';
            node = null;
        } 
        if(listaDeNodos.length > 0)
        {
            // Seleccionar el nodo
            node = listaDeNodos[0];
            // Se da preferencia a la seleccion de un nodo respecto a la de un arco
            edge = null; 
            activeGraph.nodes.selectNode(node); //Seleccionamos el primer nodo de la lista (nodo 0)
            document.getElementById('node_label').value = node.label;
            listaDeNodos = [];
        } 
       

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
  
                if (node != null) {
                    if (activeNodes.nodeSelected !== null && activeNodes.nodeSelected !== node) {
                        // Crear una arista entre el nodo previamente seleccionado y el nodo actual
                        activeGraph.addEdge(activeNodes.nodeSelected, node);
                        activeNodes.unSelectNodes(); // Deseleccionar todos los nodos
                    } else if (activeNodes.nodeSelected === null && !node.selected) {
                        // Seleccionar el nodo si no hay ninguno seleccionado
                        activeNodes.selectNode(node);
                        labelInput.value(node.label); // Actualizar con el nombre del nodo
                    }
                } else {
                    if (edge != null) {
                        // Si la arista ya está seleccionada, deseleccionarla
                        if (activeGraph.edges.selectedEdge === edge) {
                            activeGraph.edges.unselectEdges();
                            edgeInput.value('');
                        } else {
                            // Seleccionar la arista y actualizar el campo de entrada de la arista
                            activeGraph.edges.selectEdge(edge);
                            edgeInput.value(edge.explicacion); // Actualizar con la explicación de la arista
                        }
                        break;
                    }
                    // Si no se hizo clic en ningún nodo existente ni en ninguna arista, considerar agregar un nuevo nodo
                    else {
                        let label = nodeCounter.toString();
                        let size = slider_node_size.value();
                        let coordenadas = coordCanvasReales(mouseX, mouseY);
                        let year = coordenadas.x; // Asegúrate de obtener las coordenadas correctas
                        let newNode = activeNodes.addNode(label, size, year); // Añadir un nuevo nodo al grafo      
                        nodeCounter++; // Incrementar el contador de nodos
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