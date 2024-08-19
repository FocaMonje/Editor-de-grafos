
var manager ;

function setup() {

    canvas = createCanvas(canvas_width, canvas_height);
    centerCanvas(canvas);

    initHtml();

    manager = new SceneManager();

    manager.addScene(Scene1);
    manager.addScene(Scene2);
    manager.addScene(Scene3);

    manager.showNextScene();
}
    

function draw() {
    manager.draw();
}

function mousePressed(){
    manager.handleEvent("mousePressed");
}

function keyPressed(){
    manager.handleEvent("keyPressed");
}


class Scene1 {

    enter(){
        this.textX = 10;
        this.textY = 0;

        background("teal");
        textAlign(CENTER);

        fill("black");
        text("Inicio del juego\n" +
        "Presiona una tecla o el ratón \n\n" +
        "Para comenzar.", width / 2, height / 2);

    }

    draw() {
       
    }

    keyPressed(){
        this.sceneManager.showNextScene();
    }

    mousePressed(){
        this.sceneManager.showNextScene();
    }
}

class Scene2 {

    enter(){

    }

    setup(){
        initState();
        setTimeout(initTimeLineGame, 2000);
    }

    draw(){

        background(220);
    
        push();
        translate(scrollX , scrollY);
        scale(zoomX,zoomY);
        
        state.graph.findEdgeUnderMouse();

        findNodesUnderMouse();
    
        state.graph.drawGraph();

        if(state.mode == "endGameMode"){
            this.sceneManager.showNextScene();
        }
    }

    mousePressed(){
        executeByMode();
    }

    keyPressed(){

    }

    
}

class Scene3 {

    enter(){

        this.textX = 10;
        this.textY = 0;

        background("teal");
        textAlign(CENTER);

        fill("black");
        text("Game Over \n\n\n" +
        " Tu puntuación es " + state.score + " \n\n"+
        "Presiona una tecla o el ratón.\n\n" +
        "Para volver a empezar.", width / 2, height / 2);

    }

    keyPressed(){
        this.sceneManager.showNextScene();
    }

    mousePressed(){
        this.sceneManager.showNextScene();
    }
}