
function setup() {

    canvas = createCanvas(canvas_width, canvas_height);
    centerCanvas(canvas);

    masterNodes = new Nodes();
    masterEdges = new Edges();
    masterGraph = new GraphManager(masterNodes, masterEdges);

    activeGraph = masterGraph;
    //gameGraph = new GraphManager(gameNodes);

    initHtml();
    
}
    

function draw() {
    
    background(220);
    
    push();
    translate(scrollX , scrollY);
    scale(zoomX,zoomY);
  
    
    activeGraph.drawEdges();
    activeGraph.drawNodes(10); //slider_node_size.value() Aquí se usa el valor del deslizador para el tamaño de los nodos


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