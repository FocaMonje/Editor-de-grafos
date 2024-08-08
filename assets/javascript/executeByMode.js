function executeByMode() {
    
    let nodeUnderMouse = null;
    let nodoPrevioSelec = null;

    const isMouseOverCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

    if(isMouseOverCanvas){ 
       

        switch (state.modo) {

            case("editorMode"): {

                switch (state.herramienta) {

                    case("draw"): {
                        console.log("****" + state.herramienta);
                         // => Mouse sobre el canvas o mouse está sobre node label
                        console.log("Mouse sobre el canvas");
                        // Si se hace clic dentro del canvas
                        
                        let edge = state.graph.findEdgeUnderMouse();

                        if (edge) {
                            // Si se hace clic en una flecha, seleccionarla
                            state.graph.edges.selectEdge(edge);
                            state.selectedEdge = edge;
                            document.getElementById('edge_info').value = edge.explicacion;
                        } else {
                             // Si no hay una flecha bajo el ratón
             
                            if (state.nodesUnderMouse.length === 0) {
                                //No hay nodo debajo del ratón
                                nodeUnderMouse = null;
                                // Crear un nuevo nodo 
                                let year = coordCanvasReales(mouseX, mouseY).x;
                                let valencia = coordCanvasReales(mouseX, mouseY).y;
                                let newNode = new Node(year, valencia);
                                addNode(state, newNode);
                                state.selectedNode = newNode;
                                document.getElementById('node_label').value = newNode.label;
                            } else {
                                // hay un nodo debajo del ratón
                                nodeUnderMouse = state.nodesUnderMouse[0];
                                if (state.selectedNode && state.selectedNode !== nodeUnderMouse) {
                                    nodoPrevioSelec = state.selectedNode;
                                    state.selectedNode = nodeUnderMouse;
                                    document.getElementById('node_label').value = state.selectedNode.label;
                                   
                                } else {
                                    state.selectedNode = nodeUnderMouse;
                                    document.getElementById('node_label').value = state.selectedNode.label;
                                }
                            }
                            if (state.selectedNode != {} && nodoPrevioSelec != null) {
                    
                                    addEdge(state, nodoPrevioSelec, state.selectedNode, explicacion = '');
        
                            }
                        }
        
                        break;
                    }

                    case("delete"): {
                        console.log("-----" + state.herramienta);
                        console.log("Soy delete Mode");
                        
                        // Miramos si hay nodos debajo del ratón y si hay se borran
                      
                        if (state.nodesUnderMouse.length > 0) {
                            deleteNode(state, state.nodesUnderMouse[0]);
                        }

                        // Buscar si hay una flecha debajo del ratón y eliminarla
                        let edge = state.graph.findEdgeUnderMouse();
                        if (edge) {
                            state.graph.edges.removeEdge(edge);
                            document.getElementById('edge_info').value = "";
                        }
                        break;
                    }
                }

                break;
            }

            case 'timeLineMode': {
                
                console.log("mouseX: " , mouseX + abs(scrollX));
                console.log("mouseY: ", mouseY + scrollY)
                console.log(state.nodesUnderMouse);

                 // hay un nodo debajo del ratón
                 if(state.nodesUnderMouse.length > 0){
                    nodeUnderMouse = state.nodesUnderMouse[0];
                    
                    if (state.selectedNode.label != undefined && state.selectedNode.label !== nodeUnderMouse.label) {
                        nodoPrevioSelec = state.selectedNode;
                        state.selectedNode = nodeUnderMouse;
                        document.getElementById('node_label').value = state.selectedNode.label;
                
                            if (state.selectedNode.year > nodoPrevioSelec.year) {
                                // Agregar la arista y hacerla visible
                                addEdge(state, nodoPrevioSelec, state.selectedNode, explicacion = 'arco correcto juego');
                                score_points += 1;
                                addEdgeToFinalPath(state.selectedNode, node);
                                state.graph.nodes.unSelectNodes();
        
                            } else {
                                score_points -= 1;
                            }
                            console.log(score_points);
                        
                    } 
                    if (state.selectedNode.label == undefined){
                        state.selectedNode = nodeUnderMouse;
                        document.getElementById('node_label').value = state.selectedNode.label;
                    }
                 }
                break;
            }


        }
    }
}
       

        /*
        switch (workMode) {
        
            case 'gameMode':{

                 // Lógica para verificar si el jugador acierta
                 //let node = activeNodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
                 if (node) {
                     if (activeNodes.nodeSelected !== null && activeNodes.nodeSelected !== node) {
                         let correctDirection = state.graph.edges.edgesList.some(edge => {
                             return edge.source === activeNodes.nodeSelected && edge.target === node;
                         });
                         if (correctDirection) {
                             state.graph.edges.edgesList.forEach(edge => {
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
                        let correctDirection = state.graph.edges.edgesList.some(edge => {
                            return edge.source === activeNodes.nodeSelected && edge.target === node;
                        });
                        if (correctDirection) {
                            state.graph.edges.edgesList.forEach(edge => {
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
                        state.graph.addEdge(activeNodes.nodeSelected, node);
                        activeNodes.unSelectNodes(); // Deseleccionar todos los nodos
                    } else if (activeNodes.nodeSelected === null && !node.selected) {
                        // Seleccionar el nodo si no hay ninguno seleccionado
                        activeNodes.selectNode(node);
                        labelInput.value(node.label); // Actualizar con el nombre del nodo
                    }
                } else {
                    if (edge != null) {
                        // Si la arista ya está seleccionada, deseleccionarla
                        if (state.graph.edges.selectedEdge === edge) {
                            state.graph.edges.unselectEdges();
                            edgeInput.value('');
                        } else {
                            // Seleccionar la arista y actualizar el campo de entrada de la arista
                            state.graph.edges.selectEdge(edge);
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
                let edge = state.graph.edges.findEdge(mouseXAdj, mouseYAdj);
                if (edge) {
                    state.graph.edges.removeEdge(edge);
                    return;
                }

                let node = activeNodes.findNode(mouseXAdj, mouseYAdj);
                if (node) {
                    activeNodes.removeNode(node);
                    state.graph.removeEdgesConnectedToNode(node);
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
                            state.graph.edges.addEdge(activeNodes.nodeSelected, node);
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
*/