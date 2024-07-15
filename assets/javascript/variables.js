
let activeNodes;
let activeGraph;
let masterNodes;
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
let moveRightButton, moveUpButton, moveLeftButton, moveDownButton;
let scroll = 0;
// let zoom = 1;
let initYear = 1000;
let lastYear = 2100;
let maxVal = 30;
let scrollX = -1 * initYear;
let scrollY = 10;
let zoomX = 1;
let zoomY = 1;
let inventos;
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