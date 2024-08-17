
function setup() {

    canvas = createCanvas(canvas_width, canvas_height);
    centerCanvas(canvas);
    
    state = new State();

    fetch('assets/data/Grafo_cartas_inventos.json')
    .then((response) => response.json())
    .then((json) => state.graph.rebuildGraph(json));

    initHtml();

    setTimeout(initTimeLineGame, 2000);

}
    

function draw() {
    
    

    background(220);
    
    push();
    translate(scrollX , scrollY);
    scale(zoomX,zoomY);
    
    state.graph.findEdgeUnderMouse();

    findNodesUnderMouse();
   
    state.graph.drawGraph();

}

function mousePressed(){
    executeByMode();
}