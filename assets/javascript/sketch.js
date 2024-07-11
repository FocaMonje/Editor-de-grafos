let nodes;
let masterGraph;
let gameNodes;
let gameGraph;
let draggingNode = null;
let saveButton, loadButton, drawModeButton, deleteModeButton, animationModeButton, startButton, stopButton, restartButton, timeLineButton;
let zoomSettings = { zoom: 35 };
let centerX, centerY;
let nodeCounter = 1;
let workMode = 'drawMode';
let labelInput;
let selectedEdge = null;
let slider_node_size, slider_start_year, slider_end_year;
let animationSettings = { startYear: 0, endYear: 0 };
let isAnimating = false;
let animationInterval;
let gameModeButton;
let gameModeActive = false;
let gameOverWindow;
let score_points = 0; 
let edges = [];
let finalPath = [];
let timer; 
let countdown = 30; // Tiempo inicial del cronómetro en segundos
let countdownInterval; // Intervalo para la cuenta atrás
let edgeInput;
let currentYearIndex = 0;
let colors = ['#008080', '#ADD8E6', '#61B2CB', '#2EA2D1'];
let gameMode2Button;
let gameMode2Active = false;
let solutionButton;
let selectedNodes = [];
let timeLineActive = false;

// const timeIntervals = [
//     { start: 1600, end: 1649 },
//     { start: 1650, end: 1699 },
//     { start: 1700, end: 1749 },
//     { start: 1750, end: 1799 },
//     { start: 1800, end: 1850 },
//     { start: 1851, end: 1900 },
//     { start: 1901, end: 1950 },
//     { start: 1951, end: 2000 }
// ];


// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let {
    VerletPhysics2D,
    VerletParticle2D,
    VerletSpring2D,
    VerletMinDistanceSpring2D,
  } = toxi.physics2d;
  
  // Reference to physics world
  let physics;

  const controls = {
    view: { x: 0, y: 0, zoom: 1 },
    viewPos: { prevX: null, prevY: null, isDragging: false },
  };

function setup() {
    canvas = createCanvas(800, 600);

    // Initialize the physics
    physics = new VerletPhysics2D();
    // Clear physics
    physics.clear();

    // Creación del slider para el tamaño de los nodos
    slider_node_size = select('#slider_node_size');

    let slider_zoom = select('#slider_zoom');
    slider_zoom.input(updateZoom);

    labelInput = select('#node_label');
    labelInput.input(modifyNodeName);

    labelInput.value(''); // limpiar node label
    
    edgeInput = select('#edge_info');
    edgeInput.input(modifyEdgeInfo);

    edgeInput.value(''); // limpiar Edge info

    nodes = new Nodes();
    masterGraph = new GraphManager(nodes, physics);

    gameNodes = new Nodes();
    gameGraph = new GraphManager(gameNodes, physics);

    saveButton = select('#saveButton');
    saveButton.mousePressed(() => {
        masterGraph.saveGraph();
    });

    loadButton = select('#loadButton');
    loadButton.mousePressed(() => {
        masterGraph.loadGraph(graph => {
            masterGraph.rebuildGraph(graph);
            nodeCounter = Math.max(...graph.nodes.map(node => parseInt(node.id))) + 1;
            setupYearSliders(graph);
        });
    });


    drawModeButton = select('#drawModeButton');
    drawModeButton.mousePressed(() => {
        workMode = 'drawMode';
        resetButtonStyles();
        drawModeButton.style('background-color', '#ddd');
    });

    deleteModeButton = select('#deleteModeButton');
    deleteModeButton.mousePressed(() => {
        workMode = 'deleteMode';
        nodesList.unSelectNodes();
        masterGraph.edges.unselectEdges();
        resetButtonStyles();
        deleteModeButton.style('background-color', '#ddd');
    });

    animationModeButton = select('#animationModeButton');
    animationModeButton.mousePressed(() => {
        workMode = 'animationMode';
        resetButtonStyles();
        animationModeButton.style('background-color', '#ddd');
        showAnimationControls();
        masterGraph.edges.edgesList.forEach(edge => edge.visible = false); // Ocultar todas las aristas
         // Ocultar todos los nodos
        nodes.setAllNodesInvisible();
        // Actualizar el gráfico para reflejar los cambios
        masterGraph.prepareJSONObject();
    });
    

    startButton = select('#startButton');
    startButton.mousePressed(startAnimation);

    // Inicializar el botón de detener
    stopButton = select('#stopButton');
    stopButton.mousePressed(stopAnimation);
    stopButton.hide(); // Ocultar el botón de detener inicialmente

    // Seleccionar el botón de reiniciar
    restartButton = select('#restartButton');
    restartButton.mousePressed(restartAnimation);
    restartButton.hide(); // Ocultar el botón de reiniciar inicialmente

    slider_start_year = select('#slider_start_year');
    slider_start_year.input(() => {
        animationSettings.startYear = slider_start_year.value();
        select('#start_year_value').html(slider_start_year.value()); // Actualizar etiqueta
    });

    slider_end_year = select('#slider_end_year');
    slider_end_year.input(() => {
        animationSettings.endYear = slider_end_year.value();
        select('#end_year_value').html(slider_end_year.value()); // Actualizar etiqueta
    });

    // Inicializar los valores de las etiquetas con los valores actuales de los deslizadores
    select('#start_year_value').html(slider_start_year.value());
    select('#end_year_value').html(slider_end_year.value());

    centerX = width / 2;
    centerY = height / 2;

    // Aplicar zoom con la rueda del ratón
    canvas.mouseWheel(e => doZoom(e));

    // Botón del modo de juego
  gameModeButton = select('#gameModeButton');
  gameModeButton.mousePressed(() => {
    resetButtonStyles();
    gameModeActive = !gameModeActive;
    if (gameModeActive) {
      enterGameMode();
    } else {
      exitGameMode();
    }
  });
  
  gameOverWindow = select('#game-over-window');
  scoreDisplay = select('#scoreDisplay'); 

  timer = select('#timer'); // Seleccionar el elemento del cronómetro

  gameMode2Button = select('#gameMode2Button');
    gameMode2Button.mousePressed(() => {
        resetButtonStyles();
        gameMode2Active = !gameMode2Active;
        if (gameMode2Active) {
            enterGameMode2();
        } else {
            exitGameMode2();
        }
    });

    solutionButton = select('#solutionButton');
    solutionButton.mousePressed(showSolution);
    solutionButton.hide(); // Ocultar el botón de solución inicialmente

    info = select('#info');
    info.hide();

    timeLineButton = select('#timeLineButton');
    timeLineButton.mousePressed(() => {
        resetButtonStyles();
        timeLineActive = !timeLineActive;
        if (timeLineActive) {
            enterTimeLineMode();
        } else {
            exitTimeLineMode();
        }
    });

  // Botones de navegación
  let moveUpButton = select('#moveUp');
  let moveLeftButton = select('#moveLeft');
  let moveDownButton = select('#moveDown');
  let moveRightButton = select('#moveRight');
  
    moveUpButton.mousePressed(() => {
        moveView(0, -20);
         
        // -------------------------------------- Filtrado de Grafos -------------------------------------

        console.log(masterGraph.nodes.nodesList);
        console.log(masterGraph.edges.edgesList);

        let grafoFemeninonodes = masterGraph.nodes.nodesList.filter(
            (node) => node.label.startsWith('L'));

  
        for (let node of grafoFemeninonodes){
            console.log(node.label);
        }

        let grafoFemeninoArcos = [];

        let nombresNodosFem = grafoFemeninonodes.map(function(element){
            return element.label;
        });


        masterGraph.edges.edgesList.forEach( function(arco){

            for (nombre of nombresNodosFem){
                if (arco.source.label === nombre){
                    grafoFemeninoArcos.push(arco);
                }
            }
        });

        gameGraph.updateGraph(grafoFemeninonodes, grafoFemeninoArcos);    
        
        console.log(gameGraph);

    });


    moveLeftButton.mousePressed(() => {
        moveView(-20, 0);
    });
    moveDownButton.mousePressed(() => {
        moveView(0, 20);
    });
    moveRightButton.mousePressed(() => {
        moveView(20, 0);
    });
}
    

function draw() {
    
    // Update the physics world 
    if(!timeLineActive){
        physics.update();
        nodes.applyRepulsion();
    } 
    

    background(220);

    // Se aplica para mouseWheel
    translate(controls.view.x, controls.view.y);
    scale(controls.view.zoom);

    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
    translate(centerX, centerY);
    scale(zoomFactor);
    translate(-centerX, -centerY);


    stroke(0);
    masterGraph.drawEdges();

    nodes.draw(slider_node_size.value()); // Aquí se usa el valor del deslizador para el tamaño de los nodos

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
