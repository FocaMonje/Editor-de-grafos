function executeByMode() {
    
    let nodeUnderMouse = null;
    let nodoPrevioSelec = null;

    // // Obtener el campo de entrada 'node_label'
    // const nodeLabelInput = document.getElementById('node_label');

    // // Verificar si el clic ocurrió en el campo 'node_label'
    // const rect = nodeLabelInput.getBoundingClientRect(); //para verificar si el clic ocurre dentro de los límites de un campo de entrada específico
    // const isMouseOverNodeLabel = (
    //      mouseX >= rect.left && mouseX <= rect.right &&
    //      mouseY >= rect.top && mouseY <= rect.bottom
    // );

    const isMouseOverCanvas = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

    // if (!isMouseOverCanvas ) {    // && !isMouseOverNodeLabel
    //     //Al hacer clic fuera del canvas se deselecciona todo
    //     console.log("Mouse fuera del canvas");
    //     nodoPrevioSelec = null;
    //     state.nodoSeleccionado = {};
    //     state.arcoSeleccionado = {};
    //     document.getElementById('node_label').value = '';
    // } 
    // if(isMouseOverNodeLabel){
    //     console.log("Mouse Sobre node label");
    // }
    if(isMouseOverCanvas){ 
       

        switch (state.modo) {

            case("editor"): {

                switch (state.herramienta) {

                    case("draw"): {
                        console.log("****" + state.herramienta);
                         // => Mouse sobre el canvas o mouse está sobre node label
                        console.log("Mouse sobre el canvas");
                        // Si se hace clic dentro del canvas
                        let listaDeNodos = state.graph.findNodesUnderMouse();

                        if (listaDeNodos.length === 0) {
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
                            nodeUnderMouse = listaDeNodos[0];
                            if (state.selectedNode && state.selectedNode !== nodeUnderMouse) {
                                nodoPrevioSelec = state.selectedNode;
                                state.selectedNode = nodeUnderMouse;
                                document.getElementById('node_label').value = state.selectedNode.label;
                                // Crear una flecha entre el nodo previamente seleccionado y el nodo actual
                                // state.graph.addEdge(nodoPrevioSelec, state.selectedNode, "");
                            } else {
                                state.selectedNode = nodeUnderMouse;
                                document.getElementById('node_label').value = state.selectedNode.label;
                            }
                        }
                        if (state.selectedNode != {} && nodoPrevioSelec != null) {
                        
                                // Crear una arista entre el nodo previamente seleccionado y el nodo actual
                                state.graph.addEdge(nodoPrevioSelec, state.selectedNode);
                                
                                
                             
                        } 
                        else {
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
                                let newNode = state.graph.addNode(label, size, year); // Añadir un nuevo nodo al grafo      
                                nodeCounter++; // Incrementar el contador de nodos
                            }
                        }
        
                        break;
                    }

                    case("deleteMode"): {
                        console.log("-----" + state.herramienta);
                        console.log("Soy delete Mode");
                        
                        // Miramos si hay nodos debajo del ratón y si hay se borran
                        let nodes = state.graph.findNodesUnderMouse();
                        if (nodes.length > 0) {
                            deleteNode(state, nodes[0]);
                        }
                        break;
                    }
                }

                break;
            }

            case("game"): {

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