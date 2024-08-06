
function setup() {

    canvas = createCanvas(canvas_width, canvas_height);
    centerCanvas(canvas);
    
    state = new State();

    initHtml();
    
}
    

function draw() {
    
    background(220);
    
    push();
    translate(scrollX , scrollY);
    scale(zoomX,zoomY);

    if (animating) {
       
        for (let i = 0; i < state.graph.nodes.nodesList.length; i++) {
            let node = state.graph.nodes.nodesList[i];
            startPositions[i] = canvas_height;
            endPositions[i] = node.y;
        }

        console.log(startPositions);
        console.log(endPositions);
        
    }
  
    state.graph.findNodesUnderMouse();
    state.graph.findEdgeUnderMouse();
    state.graph.drawEdges();
    state.graph.drawNodes(10); //slider_node_size.value() Aquí se usa el valor del deslizador para el tamaño de los nodos

    draw_grid(width, height);
    
    if (gameModeActive) {
        checkGameCompletion();
    }

    if (gameMode2Active) {
        checkGameCompletion2();
    }

    if (timeLineActive) {
        checkGameCompletion();
    }
}

function mousePressed(){
    executeByMode();
}