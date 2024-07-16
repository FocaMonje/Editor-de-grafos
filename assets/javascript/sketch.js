

function preload() {
    grafo = loadJSON('assets/data/initGraph.json');
  }

function setup() {
    canvas = createCanvas(1000, 500);
    centerCanvas(canvas);

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

  
    masterNodes = new Nodes();
    masterGraph = new GraphManager(masterNodes, physics);

    activeNodes = new Nodes();
    activeGraph = new GraphManager(activeNodes, physics);

    gameNodes = new Nodes();
    gameGraph = new GraphManager(gameNodes, physics);

    graphic(grafo);

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
            activeGraph = masterGraph;
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
        activeGraph.edges.unselectEdges();
        resetButtonStyles();
        deleteModeButton.style('background-color', '#ddd');
    });

    animationModeButton = select('#animationModeButton');
    animationModeButton.mousePressed(() => {
        workMode = 'animationMode';
        resetButtonStyles();
        animationModeButton.style('background-color', '#ddd');
        showAnimationControls();
        activeGraph.edges.edgesList.forEach(edge => edge.visible = false); // Ocultar todas las aristas
         // Ocultar todos los nodos
        activeNodes.setAllNodesInvisible();
        // Actualizar el gráfico para reflejar los cambios
        activeGraph.prepareJSONObject();
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
    // canvas.mouseWheel(e => doZoom(e));

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

    filterGraphButton = select('#filterGraphButton');
    filterGraphButton.mousePressed(() => {
        activeGraph = filterGraph(masterGraph, (node) => (node.year > 1800 && node.year < 1900));
        console.log(activeGraph);
    });

  // Botones de navegación
  let moveUpButton = select('#moveUp');
  let moveLeftButton = select('#moveLeft');
  let moveDownButton = select('#moveDown');
  let moveRightButton = select('#moveRight');
  
    moveUpButton.mousePressed(() => {
        moveView(0, -20);
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
    // if(!timeLineActive){
    //     physics.update();
    //     activeNodes.applyRepulsion();
    // } 

    

    background(220);

    const alturaDibujo = height - 100;

    push();
    translate(scrollX , scrollY);
    scale(zoomX,zoomY);
  
    draw_grid(width, height);
  
    let alturaInicial = height - 50;
  
    for(let i = 0; i < inventos.length; i++){
      fill(0);
      noStroke();
      let r = 15;
      if (inventos[i].year == undefined)
        continue;
        
      let intevaloVal = Math.floor(alturaDibujo / maxVal);
      let x = inventos[i].year;
      let y = alturaDibujo - inventos[i].valencia * intevaloVal;
      ellipse(x, y , r * (r/(r * zoomX) ), r * (r/(r * zoomY)));
      
      
      for(let j = 0; j < inventos[i].flechas.length; j++){
        let k = indiceDeInvento(inventos[i].flechas[j], inventos)
        let x_d = inventos[k].year;
        let y_d = alturaDibujo - inventos[k].valencia * intevaloVal;
        let arrow = new Edge(inventos[i],inventos[k] , "");   
        arrow.drawArrow(x, y, x_d, y_d, 5);
        //console.log(inventos[i].id + " -> " + inventos[k].id);
      }
      
      
    }
    
    pop();

    
    push();
    translate(width/2, height/2);
    fill(150);
    noStroke();
    ellipse(0, 0, 10, 10);
    pop();


    // logic scroll
    // if(moveLeftButton){
    //     scrollX -= 5;
    // }
    
    // if(moveRightButton){
    //     scrollX += 5;
    // }
    
    // if(moveUpButton){
    //     scrollY += 5;
    // }
    
    // if(moveDownButton){
    //     scrollY -= 5;
    // }

    // Se aplica para mouseWheel
    // translate(controls.view.x, controls.view.y);
    // scale(controls.view.zoom);

    /*
    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
    translate(centerX, centerY);
    scale(zoomFactor);
    translate(-centerX, -centerY);


    stroke(0);
    activeGraph.drawEdges();

    activeGraph.drawNodes(slider_node_size.value()); // Aquí se usa el valor del deslizador para el tamaño de los nodos

    if (gameModeActive) {
        checkGameCompletion();
    }

    if (gameMode2Active) {
        checkGameCompletion2();
    }

    
    if (timeLineActive) {
        checkGameCompletion();
    }

    */
    
}
