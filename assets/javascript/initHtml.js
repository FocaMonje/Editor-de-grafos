
function createCustomButton(id, text, parent, onClick) {
    let button = document.createElement("button");
    button.id = id;
    button.textContent = text;
    button.classList.add("header");
    button.addEventListener("click", onClick);
    parent.appendChild(button);
    return button;
}

function createCustomSlider(id, min, max, value, parent, onInput) {
    let label = document.createElement("label");
    label.for = id;
    label.textContent = id.replace(/_/g, ' ') + ':';

    let slider = document.createElement("input");
    slider.type = "range";
    slider.id = id;
    slider.min = min;
    slider.max = max;
    slider.value = value;

    slider.addEventListener("input", onInput);

    parent.appendChild(label);
    parent.appendChild(slider);

    return slider; // Devuelve el deslizador
}

function createDropdown(id, options, parent, onChange) {
    let select = document.createElement("select");
    select.id = id;
    select.classList.add("header");

    options.forEach(option => {
        let optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    select.addEventListener("change", onChange);

    parent.appendChild(select);
    return select;
}

function initHtml() {
    let header = document.getElementById('header'); // Obtiene el elemento con ID "header"

    // Creación de botones Guardar y Cargar
    saveButton = createCustomButton("saveButton", "Guardar Grafo", header, () => {
        masterGraph.saveGraph();
    });

    loadButton = createCustomButton("loadButton", "Cargar Grafo", header, () => {
        masterGraph.loadGraph(graph => {
            masterGraph.rebuildGraph(graph);
            nodeCounter = Math.max(...graph.nodes.map(node => parseInt(node.id))) + 1;
            setupYearSliders(graph);
            activeGraph = masterGraph;
        });
    });

    // Creación de la lista con los modos
    let modes = ["Draw Mode", "Delete Mode", "Animation Mode", "Game Mode", "Game Mode 2", "Time Line"];
    modeDropdown = createDropdown("modeDropdown", modes, header, () => {
        switch (modeDropdown.value) {
            case "Draw Mode":
                workMode = 'drawMode';
                resetButtonStyles();
                modeDropdown.style.backgroundColor = '#ddd';
                break;
            case "Delete Mode":
                workMode = 'deleteMode';
                activeNodes.unSelectNodes();
                activeGraph.edges.unselectEdges();
                resetButtonStyles();
                modeDropdown.style.backgroundColor = '#ddd';
                break;
            case "Animation Mode":
                workMode = 'animationMode';
                resetButtonStyles();
                modeDropdown.style.backgroundColor = '#ddd';
                showAnimationControls();
                activeGraph.edges.edgesList.forEach(edge => edge.visible = false); 
                activeNodes.setAllNodesInvisible();
                activeGraph.prepareJSONObject();
                break;
            case "Game Mode":
                resetButtonStyles();
                gameModeActive = !gameModeActive;
                if (gameModeActive) {
                    enterGameMode();
                } else {
                    exitGameMode();
                }
                break;
            case "Game Mode 2":
                resetButtonStyles();
                gameMode2Active = !gameMode2Active;
                if (gameMode2Active) {
                    enterGameMode2();
                } else {
                    exitGameMode2();
                }
                break;
            case "Time Line":
                resetButtonStyles();
                timeLineActive = !timeLineActive;
                if (timeLineActive) {
                    enterTimeLineMode();
                } else {
                    exitTimeLineMode();
                }
                break;
        }
    });

    // Botón de filtrar gráfico
    filterGraphButton = createCustomButton("filterGraphButton", "Filter Graph", header, () => {
        activeGraph = filterGraph(masterGraph, (node) => (node.year > 1800 && node.year < 1900));
        console.log(activeGraph);
    });

    // Creación de controles de navegación
    let navigationControls = document.getElementById('navigation-controls'); 
    createCustomButton("moveUp", "↑", navigationControls, () => moveView(0, -20));
    createCustomButton("moveLeft", "←", navigationControls, () => moveView(-20, 0));
    createCustomButton("moveDown", "↓", navigationControls, () => moveView(0, 20));
    createCustomButton("moveRight", "→", navigationControls, () => moveView(20, 0));

    // Creación de los controles de zoom
    let zoomControls = document.getElementById('zoom-controls');

    // Controles para Zoom X
    let zoomXControls = document.createElement('div');
    zoomXControls.id = 'zoomX-controls';
 
    let zoomXLabel = document.createElement('p');
    zoomXLabel.innerText = 'ZoomX:';
    zoomXControls.appendChild(zoomXLabel);
 
    let increaseXZoomButton = document.createElement('button');
    increaseXZoomButton.id = 'increaseXZoom';
    increaseXZoomButton.innerText = '+';
    increaseXZoomButton.addEventListener('click', updateIncreaseXZoom);
    zoomXControls.appendChild(increaseXZoomButton);
 
    let decreaseXZoomButton = document.createElement('button');
    decreaseXZoomButton.id = 'decreaseXZoom';
    decreaseXZoomButton.innerText = '-';
    decreaseXZoomButton.addEventListener('click', updateDecreaseXZoom);
    zoomXControls.appendChild(decreaseXZoomButton);
 
    zoomControls.appendChild(zoomXControls);
 
    // Controles para Zoom Y
    let zoomYControls = document.createElement('div');
    zoomYControls.id = 'zoomY-controls';
 
    let zoomYLabel = document.createElement('p');
    zoomYLabel.innerText = 'ZoomY:';
    zoomYControls.appendChild(zoomYLabel);
 
    let increaseYZoomButton = document.createElement('button');
    increaseYZoomButton.id = 'increaseYZoom';
    increaseYZoomButton.innerText = '+';
    increaseYZoomButton.addEventListener('click', updateIncreaseYZoom);
    zoomYControls.appendChild(increaseYZoomButton);
 
    let decreaseYZoomButton = document.createElement('button');
    decreaseYZoomButton.id = 'decreaseYZoom';
    decreaseYZoomButton.innerText = '-';
    decreaseYZoomButton.addEventListener('click', updateDecreaseYZoom);
    zoomYControls.appendChild(decreaseYZoomButton);
 
    zoomControls.appendChild(zoomYControls);

    // Creación de slider para cambio de tamaño del nodo
    let divIzquierda = document.getElementById('div-izquierda'); 
    slider_node_size = createCustomSlider('slider_node_size', 5, 50, 20, divIzquierda, () => {
        slider_node_size = select('#slider_node_size');
    });

    // Creación de botones del modo Animación
    startButton = createCustomButton("startButton", "Start", divIzquierda, startAnimation);
    startButton.style.display = "none"; // Ocultar inicialmente
    stopButton = createCustomButton("stopButton", "Stop", divIzquierda, stopAnimation);
    stopButton.style.display = "none"; // Ocultar inicialmente
    restartButton = createCustomButton("restartButton", "Restart", divIzquierda, restartAnimation);
    restartButton.style.display = "none"; // Ocultar inicialmente

    // Slider para el año de inicio de la animación
    // slider_start_year = createCustomSlider("slider_start_year", 1000, 2024, 1000, divIzquierda, () => {
    //     animationSettings.startYear = slider_start_year.value;
    //     document.getElementById('start_year_value').textContent = slider_start_year.value; // Actualiza el texto del valor del año de inicio
    // });

    // Slider para el año de fin de la animación
    // slider_end_year = createCustomSlider("slider_end_year", 1000, 2024, 2024, divIzquierda, () => {
    //     animationSettings.endYear = slider_end_year.value;
    //     document.getElementById('end_year_value').textContent = slider_end_year.value; // Actualiza el texto del valor del año de fin
    // });

    // Inicializar los valores de las etiquetas con los valores actuales de los deslizadores
    // document.getElementById('start_year_value').textContent = slider_start_year.value;
    // document.getElementById('end_year_value').textContent = slider_end_year.value;

    centerX = width / 2;
    centerY = height / 2;
}
