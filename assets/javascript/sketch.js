let nodes;
let graphManager;
let draggingNode = null;
let saveButton, loadButton, drawModeButton, deleteModeButton, selectedModeButton;
let zoomSettings = { zoom: 35 };
let centerX, centerY;
let nodeCounter = 1;
let workMode = 'drawMode';
let labelInput;
let selectedEdge = null;

function setup() {
    createCanvas(800, 600);

    let slider_zoom = select('#slider_zoom');
    slider_zoom.input(updateZoom);

    labelInput = select('#node_label');
    labelInput.input(modifyNodeName);

    labelInput.value(''); // limpiar node label

    nodes = new Nodos();
    graphManager = new GraphManager(nodes);

    saveButton = select('#saveButton');
    saveButton.mousePressed(() => {
        graphManager.saveGraph();
    });

    loadButton = select('#loadButton');
    loadButton.mousePressed(() => {
        graphManager.loadGraph(graph => {
            graphManager.rebuildGraph(graph);
            nodeCounter = Math.max(...graph.nodes.map(node => parseInt(node.id))) + 1;
        });
    });

    drawModeButton = select('#drawModeButton');
    drawModeButton.mousePressed(() => {
        workMode = 'drawMode';
        drawModeButton.style('background-color', '#ddd');
        deleteModeButton.style('background-color', '');
        selectedModeButton.style('background-color', '');
    });

    deleteModeButton = select('#deleteModeButton');
    deleteModeButton.mousePressed(() => {
        workMode = 'deleteMode';
        nodes.unSelectNodes();
        graphManager.edges.unselectEdges();
        deleteModeButton.style('background-color', '#ddd');
        drawModeButton.style('background-color', '');
        selectedModeButton.style('background-color', '');
    });

    selectedModeButton = select('#selectedModeButton');
    selectedModeButton.mousePressed(() => {
        workMode = 'selectedMode';
        selectedModeButton.style('background-color', '#ddd');
        drawModeButton.style('background-color', '');
        deleteModeButton.style('background-color', '');
    });

    centerX = width / 2;
    centerY = height / 2;
}

function draw() {
    background(220);

    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
    translate(centerX, centerY);
    scale(zoomFactor);
    translate(-centerX, -centerY);

    nodes.applyRepulsion();

    stroke(0);
    graphManager.drawEdges();

    nodes.draw();

    if (workMode === 'selectedMode') {
        let edgeInfoDiv = select('#edge-info');
        if (selectedEdge) {
            edgeInfoDiv.html(selectedEdge.explicacion || "No hay información");
            edgeInfoDiv.style('display', 'block');
        } else {
            edgeInfoDiv.style('display', 'none');
        }
    }
}