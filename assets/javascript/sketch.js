
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
        let elapsed = millis() - animationStart;
        let progress = min(elapsed / animationDuration, 1);
        
        for (let i = 0; i < state.graph.nodes.nodesList.length; i++) {
            let node = state.graph.nodes.nodesList[i];
            let startPos = startPositions[i];
            let endPos = endPositions[i];
            
            node.x = lerp(startPos.x, endPos.x, progress);
            node.y = lerp(startPos.y, endPos.y, progress);
        }
        
        if (progress === 1) {
            animating = false;
            //noLoop(); // Detiene el bucle de animación cuando se completa
          }
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