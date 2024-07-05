// Función para seleccionar un intervalo de tiempo al azar
// function getRandomTimeInterval() {
//     const randomIndex = Math.floor(Math.random() * timeIntervals.length);
//     return timeIntervals[randomIndex];
// }

// Función para seleccionar 5 inventos al azar dentro de un intervalo de tiempo
// function getRandomInventos(interval, nodes) {
//     const inventosInInterval = nodes.filter(node => node.year >= interval.start && node.year <= interval.end);
//     if (inventosInInterval.length <= 5) return inventosInInterval;
    
//     const selectedInventos = [];
//     while (selectedInventos.length < 5) {
//         const randomIndex = Math.floor(Math.random() * inventosInInterval.length);
//         const selected = inventosInInterval.splice(randomIndex, 1)[0];
//         selectedInventos.push(selected);
//     }
//     return selectedInventos;
// }

// Función para entrar en Game Mode 2
function enterGameMode2() {
    workMode = "gameMode2";
    const button = document.getElementById('gameMode2Button');
    button.textContent = 'Exit Game Mode 2'; // Cambiar texto del botón

    // Ocultar el botón "Show Solution"
    document.getElementById('solutionButton').style.display = 'none';

    // Ocultar los controles y deshabilitar la creación de nodos
    slider_node_size.attribute('disabled', true);
    labelInput.attribute('disabled', true);

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');

    // Iniciar el cronómetro
    countdown = 30; // Reiniciar el tiempo del cronómetro
    timer.html('Tiempo: ' + countdown); // Mostrar el tiempo inicial
    timer.style('display', 'block');
    countdownInterval = setInterval(() => {
        countdown--;
        timer.html('Tiempo: ' + countdown);
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000);

    // Seleccionar un intervalo de tiempo aleatorio
    const intervals = [
        { start: 1600, end: 1700 },
        { start: 1701, end: 1800 },
        { start: 1801, end: 1900 },
        { start: 1901, end: 2000 }
    ];
    const randomInterval = intervals[Math.floor(Math.random() * intervals.length)];

    // Filtrar nodos dentro del intervalo de tiempo seleccionado
    const nodesInInterval = nodes.nodes.filter(node => node.year >= randomInterval.start && node.year <= randomInterval.end);

    // Seleccionar cinco nodos aleatorios
    selectedNodes = [];
    while (selectedNodes.length < 20 && nodesInInterval.length > 0) {
        const randomIndex = Math.floor(Math.random() * nodesInInterval.length);
        selectedNodes.push(nodesInInterval.splice(randomIndex, 1)[0]);
    }

    // Mostrar solo los nodos seleccionados y sus aristas correspondientes
    nodes.nodes.forEach(node => {
        node.visible = selectedNodes.includes(node);
    });

     // Ocultar las flechas (edges)
     graphManager.edges.edges.forEach(edge => {
        edge.visible = false;
    });

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style.display = 'none';
}

function exitGameMode2() {
    workMode = "drawMode";
    const button = document.getElementById('gameMode2Button');
    button.textContent = 'Game Mode 2'; // Restaurar texto original del botón

    // Ocultar el botón "Show Solution"
    document.getElementById('solutionButton').style.display = 'none';

    hideScore();

    // Mostrar los controles y habilitar la creación de nodos
    slider_node_size.removeAttribute('disabled');
    labelInput.removeAttribute('disabled');

    // Restaurar la visibilidad de los nodos y las aristas
    nodes.nodes.forEach(node => {
        node.visible = true;
    });

    graphManager.edges.edges.forEach(edge => {
        edge.visible = true; // Implementar la lógica de visibilidad
    });

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');

    // Detener el cronómetro
    clearInterval(countdownInterval);
    timer.html('Tiempo: 30'); // Resetear el tiempo mostrado
    timer.style('display', 'none'); // Ocultar el temporizador
}

function endGame2() {
    clearInterval(countdownInterval);
    let points = evaluateScorePoints();
    displayScore(points);

     // Verificar si se encontraron todas las flechas
     let allEdgesVisible = graphManager.edges.edges.every(edge => edge.visible);

     if (!allEdgesVisible) {
         document.getElementById('solutionButton').style.display = 'block'; // Mostrar el botón "Show Solution" si no se encontraron todas las flechas
     }
}

function checkGameCompletion2() {
    // Verificar si todas las flechas están visibles
    let allEdgesVisible = graphManager.edges.edges.every(edge => edge.visible);

    // Si todas las flechas están visibles, mostrar la ventana de fin del juego
    if (allEdgesVisible) {
        endGame2();
        gameOverWindow.style.display = 'block';
        document.getElementById('solutionButton').style.display = 'none'; // Ocultar el botón "Show Solution"
    } else {
        document.getElementById('solutionButton').style.display = 'block'; // Mostrar el botón "Show Solution"
    }
}

// function displayScore2(points) {
//     scoreDisplay.html(`Puntuación: ${points}`); // Mostrar la puntuación en el elemento HTML correspondiente
//     scoreDisplay.style('display', 'block'); // Asegurarse de que el elemento sea visible
//     document.getElementById('solutionButton').style.display = 'block'; // Mostrar el botón "Show Solution"
// }

// Función para mostrar la solución
function showSolution() {
    // Mostrar todas las flechas correspondientes a los nodos seleccionados
    graphManager.edges.edges.forEach(edge => {
        if (selectedNodes.includes(edge.source) && selectedNodes.includes(edge.target)) {
            edge.visible = true; // Mostrar la flecha si ambos nodos están seleccionados
        }
    });
    selectedNodes.forEach(node => {
        node.visible = true; // Mostrar todos los nodos seleccionados
    });
}
