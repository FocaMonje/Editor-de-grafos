function executeByMode() {
    
    let nodeUnderMouse = null;
    let nodoPrevioSelec = null;

    if (!(mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height)) {
        //Al hacer clic fuera del canvas se deselecciona todo
        nodoPrevioSelec = null;
        state.nodoSeleccionado = {};
        state.arcoSeleccionado = {};
        document.getElementById('node_label').value = '';
    } else {
        // Si se hace clic dentro del canvas
        let listaDeNodos = state.graph.findNodesUnderMouse();

        if (listaDeNodos.length === 0) {
            //No hay nodo debajo del ratón
            nodeUnderMouse = null;
            // Crear un nuevo nodo 
            let label = "Nodo " + state.graph.nodes.nodeCounter;
            let size = 20; 
            let year = coordCanvasReales(mouseX, mouseY).x;
            let newNode = new Node(label, size, year);
            state.addNode(newNode);
            state.nodoSeleccionado = newNode;
            document.getElementById('node_label').value = newNode.label;
        } else {
            // hay un nodo debajo del ratón
            nodeUnderMouse = listaDeNodos[0];
            if (state.nodoSeleccionado && state.nodoSeleccionado !== nodeUnderMouse) {
                nodoPrevioSelec = state.nodoSeleccionado;
                state.nodoSeleccionado = nodeUnderMouse;
                document.getElementById('node_label').value = state.nodoSeleccionado.label;
                // Crear una flecha entre el nodo previamente seleccionado y el nodo actual
                state.graph.addEdge(nodoPrevioSelec, state.nodoSeleccionado, "");
            } else {
                state.nodoSeleccionado = nodeUnderMouse;
                document.getElementById('node_label').value = state.nodoSeleccionado.label;
            }
        }
    
       
        // nodoPrevioSelec = null;
        // state.nodoSeleccionado={};
        // state.arcoSeleccionado={};
        // document.getElementById('node_label').value = '';
        // } 
        // else {
        
        // let listaDeNodos = state.graph.findNodesUnderMouse();
        // let edgeUnderMouse = state.graph.edges.findEdgeUnderMouse();
        
        // if(listaDeNodos == []) {
        //     nodeUnderMouse = null;
        // } 
        // if(listaDeNodos.length > 0)
        // {
        //     // Seleccionar el nodo
        //     nodeUnderMouse = listaDeNodos[0];
        //     // Se da preferencia a la seleccion de un nodo respecto a la de un arco
        //     edgeUnderMouse = null; 
        //     if(state.nodoSeleccionado && state.nodoSeleccionado != nodeUnderMouse){
        //         nodoPrevioSelec = state.nodoSeleccionado;
        //         console.log(nodoPrevioSelec);
        //     }
        //     state.nodoSeleccionado = nodeUnderMouse; //Seleccionamos el primer nodo de la lista (nodo 0)
        //     document.getElementById('node_label').value = state.nodoSeleccionado.label;
        //     listaDeNodos = [];
        // } 


        /*
        switch (state.modo) {

            case("editor"): {

                switch (state.herramienta) 

                    case("draw")
                    case("delete")
  
            }
            case("game"): {

            }
         */



        switch (state.modo) {

            case("editor"): {

                switch (state.herramienta) {

                    case("draw"): {

                        // if (state.nodoSeleccionado != {} && nodoPrevioSelec != null) {
                        
                        //         // Crear una arista entre el nodo previamente seleccionado y el nodo actual
                        //         let newGraph = state.graph.addEdge(state.nodoSeleccionado, nodoPrevioSelec);
                        //         state.graph = newGraph;
                        //         //state.nodoSeleccionado = {}; // Deseleccionar todos los nodos
                        //         //nodoPrevioSelec = {};
                             
                        // } 
                        //else {
                        //     if (edge != null) {
                        //         // Si la arista ya está seleccionada, deseleccionarla
                        //         if (state.graph.edges.selectedEdge === edge) {
                        //             state.graph.edges.unselectEdges();
                        //             edgeInput.value('');
                        //         } else {
                        //             // Seleccionar la arista y actualizar el campo de entrada de la arista
                        //             state.graph.edges.selectEdge(edge);
                        //             edgeInput.value(edge.explicacion); // Actualizar con la explicación de la arista
                        //         }
                        //         break;
                        //     }
                        //     // Si no se hizo clic en ningún nodo existente ni en ninguna arista, considerar agregar un nuevo nodo
                        //     else {
                        //         let label = nodeCounter.toString();
                        //         let size = slider_node_size.value();
                        //         let coordenadas = coordCanvasReales(mouseX, mouseY);
                        //         let year = coordenadas.x; // Asegúrate de obtener las coordenadas correctas
                        //         let newNode = state.graph.addNode(label, size, year); // Añadir un nuevo nodo al grafo      
                        //         nodeCounter++; // Incrementar el contador de nodos
                        //     }
                        // }
        
                        break;
                    }

                    case("delete"): {
        
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