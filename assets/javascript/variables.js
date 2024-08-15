let state = {};
let canvas;
let listOfStates = [];
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
let edicionLabel = false;

// Variables para el control grafico
let canvas_height = 500;
let canvas_width = 900;
let grafo ;
let inventos;
let initYear = 1000;
let lastYear = 2100;
let maxVal = 30;
let scrollX = -1140;
let scrollY = 10;
let zoomX = 1;
let zoomY = 1;

let animationStart = 0;
let animationDuration = 2000; // Duración en milisegundos
const alturaDibujo = canvas_height - 60;
let genAlpha = {};

let y = canvas_height;


let increaseX, increaseY, decreaseX, decreaseY;









  