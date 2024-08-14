

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
    console.log("addEdgeToFinalPath finalPath: ",finalPath);
    console.log("addEdgeToFinalPath edges: ", edges);
}
