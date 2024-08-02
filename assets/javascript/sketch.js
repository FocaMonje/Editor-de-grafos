
function setup() {

    canvas = createCanvas(canvas_width, canvas_height);
    centerCanvas(canvas);
    
    listOfStates.push(state);

    initHtml();
    
}
    

function draw() {
    
    background(220);
    
    push();
    translate(scrollX , scrollY);
    scale(zoomX,zoomY);
  
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