
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
    
    state.graph.findEdgeUnderMouse();

    findNodesUnderMouse();
   
    
    state.graph.drawEdges();
    state.graph.drawNodes(10); //slider_node_size.value() Aquí se usa el valor del deslizador para el tamaño

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