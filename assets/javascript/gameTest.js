
function enterGameMode() {
    workMode = "gameMode";
    const button = document.getElementById('gameModeButton');
    button.textContent = 'Exit Game Mode'; // Cambiar texto del botón
    // Ocultar los controles y deshabilitar la creación de nodos
    slider_node_size.attribute('disabled', true);
    labelInput.attribute('disabled', true);

    // Ocultar las flechas (edges)
    graphManager.edges.edges.forEach(edge => {
        edge.visible = false;
    });
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
}

function exitGameMode() {
    workMode = "drawMode";
    const button = document.getElementById('gameModeButton');
    button.textContent = 'Game Mode'; // Restaurar texto original del botón
    hideScore();
    // Mostrar los controles y habilitar la creación de nodos
    slider_node_size.removeAttribute('disabled');
    labelInput.removeAttribute('disabled');

    // Restaurar la visibilidad de las flechas (edges) según la lógica del juego
    graphManager.edges.edges.forEach(edge => {
        edge.visible = true; // Implementar la lógica de visibilidad según el juego
    });

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');
   // Detener el cronómetro
   clearInterval(countdownInterval); // Detener el cronómetro
   timer.html('Tiempo: 30'); // Resetear el tiempo mostrado
    timer.style('display', 'none'); // Ocultar el temporizador
}

function checkGameCompletion() {
    // Verificar si todas las flechas están visibles
    let allEdgesVisible = graphManager.edges.edges.every(edge => edge.visible);

    // Si todas las flechas están visibles, mostrar la ventana de fin del juego
    if (allEdgesVisible) {
        endGame();
        gameOverWindow.style('display', 'block');
    }
}

// Función para terminar el juego y evaluar la puntuación
function endGame() {
    clearInterval(countdownInterval); // Detener el cronómetro
    let points = evaluateScorePoints();
    displayScore(points);
}

// Función para evaluar la puntuación
// function evaluateScore() {
//     let score = 0;  // Reiniciar la puntuación
//     let realEdges = getRealEdges();  // Obtener flechas reales del grafo
//     let playerEdges = getPlayerEdges();  // Obtener flechas propuestas por el jugador
    
//     console.log("Real Edges:", JSON.stringify(realEdges, null, 2));
//     console.log("Player Edges:", JSON.stringify(playerEdges, null, 2));

//     // Verificar cada arista propuesta por el jugador
//     playerEdges.forEach(playerEdge => {
//         let foundMatch = realEdges.some(realEdge => areEdgesEqual(realEdge, playerEdge));
//         console.log(`Player Edge: ${JSON.stringify(playerEdge.from)} -> ${JSON.stringify(playerEdge.to)}, Match Found: ${foundMatch}`);

//         if (foundMatch) {
//             score += 1;  // Acierto: sumar 1 punto
//         } else {
//             score -= 0.2;  // Error: restar 0.2 puntos
//         }
//     });

//     // Asegurarse de que la puntuación no sea negativa
//     if (score < 0) {
//         score = 0;
//     }

//     console.log("Final Score:", score);
//     return score;
// }


// Función para mostrar la puntuación
function displayScore(points) {
    scoreDisplay.html(`Puntuación: ${points}`); // Mostrar la puntuación en el elemento HTML correspondiente
    scoreDisplay.style('display', 'block'); // Asegurarse de que el elemento sea visible
}