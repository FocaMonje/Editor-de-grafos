 // -------------------------------------- Filtrado de Grafos -------------------------------------

        // console.log(activeGraph.nodes.nodesList);
        // console.log(activeGraph.edges.edgesList);

        function filterGraph(graphMaster, filterFunction) {
            outputNodes = new Nodes();
            outputGraph = new GraphManager(outputNodes, physics);
            let outputGraphNodes = graphMaster.nodes.nodesList.filter(filterFunction);
    
            let outputGraphEdges = [];
    
            let filterAttribute = outputGraphNodes.map(function(element){
                return element.label;
            });
            
            graphMaster.edges.edgesList.forEach(function(arco) {
                // Verificar que ambos extremos de la arista estén en la lista de nodos filtrados
                if (filterAttribute.includes(arco.source.label) && filterAttribute.includes(arco.target.label)) {
                    outputGraphEdges.push(arco);
                }
            });
    
            for (node of outputGraphNodes ){
                outputGraph.addNode(node);
            }
            
            for (edge of outputGraphEdges ){
            
                outputGraph.addEdge(edge.source, edge.target, edge.explicacion); 
            }

            return outputGraph;
        }
        
        // gameGraph = filterGraph(masterGraph,  (node) => (node.year > 1800 && node.year < 1900));
        // gameGraph = filterGraph(masterGraph,  (node) => node.label.includes("pila"));
        //(node) => node.label.includes("pila")
        //(node) => node.label.starsWith("L")
        // (node) => node.label.length < 8
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
        // console.log(gameGraph);

        // activeGraph = gameGraph;