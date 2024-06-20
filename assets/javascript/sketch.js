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
let slider_node_size;

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

    nodes = new Nodos();
    graphManager = new GraphManager(nodes, physics);

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

    // Aplicar zoom con la rueda del ratón
    canvas.mouseWheel(e => doZoom(e));
}

function draw() {

    // Update the physics world
    physics.update();

    background(220);

    // Se aplica para mouseWheel
    translate(controls.view.x, controls.view.y);
    scale(controls.view.zoom);

    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
    translate(centerX, centerY);
    scale(zoomFactor);
    translate(-centerX, -centerY);

    nodes.applyRepulsion();

    stroke(0);
    graphManager.drawEdges();

    nodes.draw(slider_node_size.value()); // Aquí se usa el valor del deslizador para el tamaño de los nodos

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
