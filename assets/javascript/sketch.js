
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
   
    state.graph.drawGraph();
}

function mousePressed(){
    executeByMode();
}