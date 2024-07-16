
function enterGameMode() {
    workMode = "gameMode";
    const button = document.getElementById('gameModeButton');
    button.textContent = 'Exit Game Mode'; // Cambiar texto del botón
    // Ocultar los controles y deshabilitar la creación de nodos
    slider_node_size.attribute('disabled', true);
    labelInput.attribute('disabled', true);

    // Ocultar las flechas (edges)
    activeGraph.edges.edgesList.forEach(edge => {
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
    activeGraph.edges.edgesList.forEach(edge => {
        edge.visible = true; // Implementar la lógica de visibilidad según el juego
    });

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');
   // Detener el cronómetro
   clearInterval(countdownInterval); // Detener el cronómetro
   timer.html('Tiempo: 30'); // Resetear el tiempo mostrado
    timer.style('display', 'none'); // Ocultar el temporizador
}