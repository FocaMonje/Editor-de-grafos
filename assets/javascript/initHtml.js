
function initHtml(){
    // Creación del slider para el tamaño de los nodos
    slider_node_size = select('#slider_node_size');

    let increaseX = select('#increaseX');
    let decreaseX = select('#decreaseX');
    let increaseY = select('#increaseY');
    let decreaseY = select('#decreaseY');

    increaseX.mousePressed(() => {
        updateIncreaseX();
    });
    decreaseX.mousePressed(() => {
        updateDecreaseX();
    });
    increaseY.mousePressed(() => {
        updateIncreaseY();
    });
    decreaseY.mousePressed(() => {
        updateDecreaseY();
    });

    labelInput = select('#node_label');
    labelInput.input(modifyNodeName);

    labelInput.value(''); // limpiar node label

    edgeInput = select('#edge_info');
    edgeInput.input(modifyEdgeInfo);

    edgeInput.value(''); // limpiar Edge info

    
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
