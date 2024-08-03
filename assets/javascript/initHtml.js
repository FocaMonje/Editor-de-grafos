// function elt(type, props, ...children) {
//     let dom = document.createElement(type);
//     if (props) Object.assign(dom, props);

//     for (let child of children) {
//         if (typeof child != "string") dom.appendChild(child);
//         else dom.appendChild(document.createTextNode(child));
//     }

//     return dom;
//     }



function createCustomInput(id, type, parent) {
    let label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = id.replace(/_/g, ' ') + ':';

    let input = document.createElement("input");
    input.type = type;
    input.id = id;

    parent.appendChild(label);
    parent.appendChild(input);

    input.addEventListener("blur", event => {
        let newLabel = event.target.value ;
        changeNode(state, state.selectedNode , newLabel);
      });

    input.addEventListener("click", () => {
        edicionLabel = true ;
        console.log("click");
        masterGraph = "holi";
        console.log(masterGraph);
      });

    return input;
}


function createCustomTextarea(id, rows, cols, parent) {
    let label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = id.replace(/_/g, ' ') + ':';

    let textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.rows = rows;
    textarea.cols = cols;

    parent.appendChild(label);
    parent.appendChild(textarea);

    return textarea;
}


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
    select.addEventListener("change", event=> console.log(event.target.value));
    select.addEventListener("change", onChange);

    parent.appendChild(select);
    return select;
}

function initHtml() {
    let header = document.getElementById('header'); // Obtiene el elemento con ID "header"
    let divDerecha = document.getElementById('div-derecha');

    // Creación de botones Guardar y Cargar
    saveButton = createCustomButton("saveButton", "Guardar Grafo", header, () => {
        state.graph.saveGraph();
    });

    loadButton = createCustomButton("loadButton", "Cargar Grafo", header, () => {
        state.graph.loadGraph(graph => {
            state.graph.rebuildGraph(graph);
            nodeCounter = Math.max(...graph.nodes.map(node => parseInt(node.id))) + 1;
            //setupYearSliders(graph);
        });
    });

    // Creación de la lista con los modos
    let modes = ["Draw Mode", "Delete Mode", "Animation Mode", "Game Mode", "Game Mode 2", "Time Line"];
    modeDropdown = createDropdown("modeDropdown", modes, header, event => {
        switch (event.target.value) {
            case "Draw Mode":
                state.modo = "editor";
                state.herramienta = "draw";
                resetButtonStyles();
                modeDropdown.style.backgroundColor = '#ddd';
                break;
            case "Delete Mode":
                state.modo = "editor";
                state.herramienta = "deleteMode";
                resetButtonStyles();
                modeDropdown.style.backgroundColor = '#ddd';
                console.log("Soy initHtml :" + state.herramienta);
                console.log("Soy initHtml :" + state.modo);
                break;
            case "Animation Mode":
                state.modo = "animation";
                resetButtonStyles();
                modeDropdown.style.backgroundColor = '#ddd';
                showAnimationControls();
                activeGraph.edges.edgesList.forEach(edge => edge.visible = false);
                activeNodes.setAllNodesInvisible();
                activeGraph.prepareJSONObject();
                break;
            case "Game Mode":
                resetButtonStyles();
                state.modo = "game";
                gameModeActive = !gameModeActive;
                if (gameModeActive) {
                    enterGameMode();
                } else {
                    exitGameMode();
                }
                break;
            case "Game Mode 2":
                resetButtonStyles();
                state.modo = "game2";
                gameMode2Active = !gameMode2Active;
                if (gameMode2Active) {
                    enterGameMode2();
                } else {
                    exitGameMode2();
                }
                break;
            case "Time Line":
                resetButtonStyles();
                state.modo = "timeLine";
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
        activeGraph = filterGraph(state.graph, (node) => (node.year > 1800 && node.year < 1900));
        console.log(activeGraph);
    });

    // Creación de controles de navegación
    let navigationControls = document.getElementById('navigation-controls'); 
    createCustomButton("moveUp", "↑", navigationControls, () => moveView(0, -20));
    createCustomButton("moveLeft", "←", navigationControls, () => moveView(-20, 0));
    createCustomButton("moveDown", "↓", navigationControls, () => moveView(0, 20));
    createCustomButton("moveRight", "→", navigationControls, () => moveView(20, 0));

    // Creación botón para deseleccionar nodo
    let deselectDiv = document.getElementById('deseleccionar');
    createCustomButton('deselectButton', 'Deseleccionar', deselectDiv, () => {
        state.selectedNode = {};
        document.getElementById('node_label').value = "";
        // console.log('Deseleccionado');
    });


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
        let newSize = parseInt(slider_node_size.value); 
        nodes.draw(newSize);
    });

    // Creación de inputs, textarea y botones en div-derecha
    createCustomInput('node_label', 'text', divDerecha);
    createCustomTextarea('edge_info', 6, 30, divDerecha);

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

    // createCustomButton("solutionButton", "Show Solution", divDerecha, () => {
    //     console.log("Mostrar solución");
    // });

    centerX = width / 2;
    centerY = height / 2;
}