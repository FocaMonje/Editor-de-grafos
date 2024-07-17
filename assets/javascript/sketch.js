
function setup() {
    canvas = createCanvas(canvas_width, canvas_height);
    centerCanvas(canvas);

    masterNodes = new Nodes();
    masterGraph = new GraphManager(masterNodes, physics);

    activeNodes = new Nodes();
    activeGraph = new GraphManager(activeNodes, physics);

    gameNodes = new Nodes();
    gameGraph = new GraphManager(gameNodes, physics);

    initHtml();
    
}
    

function draw() {
    
    background(220);
    
    push();
    translate(scrollX , scrollY);
    scale(zoomX,zoomY);
  
    
    activeGraph.drawEdges();
    activeGraph.drawNodes(slider_node_size.value()); // Aquí se usa el valor del deslizador para el tamaño de los nodos

    

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
