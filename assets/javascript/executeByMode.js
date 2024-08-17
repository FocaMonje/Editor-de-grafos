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
                        
                        document.getElementById('node_label').value = state.selectedNode.label;
                
                        // Verificar si el nodo bajo el ratón es el siguiente nodo más moderno en la lista
                        let indexPrevioSelec = state.gameNodes.findIndex(node => node.label === nodoPrevioSelec.label);
                        let indexActual = state.gameNodes.findIndex(node => node.label === nodeUnderMouse.label);

                        if (indexActual === indexPrevioSelec + 1) {
                            // Agregar la arista y hacerla visible
                            state.selectedNode = nodeUnderMouse;
                            addGameEdge(nodoPrevioSelec, state.selectedNode, 'arco correcto juego');
                            updateScore(1);
                            
                            state.graph.nodes.unSelectNodes();
                            if (state.gameEdges.length == state.numNodesGame - 1){
                                //  initAnimation --> animationMode --> solutionMode --> (numNodesGame += 1) --> timeLineMode
                                setTimeout(function(){initNodeAnimation();
                                                        initGridAnimation();}
                                                        , 800);
                                
                                setTimeout(function() { state.mode = "timeLineMode";
                                                        state.numNodesGame += 1;
                                                        state.gameNodes = [];
                                                        state.gameEdges = [];
                                                        enterTimeLineMode(); }
                                                        , 4000);
                            }
                        } else {
                            updateScore(-1);
                        }
                            console.log(state.score);
                        
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
       
