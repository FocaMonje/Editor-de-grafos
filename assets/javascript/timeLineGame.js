
function enterTimeLineMode() {
    workMode = "timeLineMode";
    const button = document.getElementById('timeLineButton');
    button.textContent = 'Exit Time Line Mode'; // Cambiar texto del botón

    // Ocultar las flechas (edges) y asegurar que los nodos sean visibles
    masterGraph.edges.edgesList.forEach(edge => {
        edge.visible = false; // Ocultar todas las flechas
    });

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');
    
    // Iniciar el cronómetro
    countdown = 1; // Reiniciar el tiempo del cronómetro
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


function exitTimeLineMode() {
    
    workMode = "drawMode";
    const button = document.getElementById('timeLineButton');
    button.textContent = 'Time Line'; // Restaurar texto original del botón

    hideScore();
    
    // Mostrar los controles y habilitar la creación de nodos
    slider_node_size.removeAttribute('disabled');
    labelInput.removeAttribute('disabled');

    // Restaurar la visibilidad de las flechas y los nodos
    masterGraph.edges.edgesList.forEach(edge => {
        edge.visible = true; // Implementar la lógica de visibilidad según el juego
    });
    masterNodes.setAllNodesVisible(); // Mostrar todos los nodos
    masterGraph. prepareJSONObject(); // Actualizar el gráfico

    // Ocultar la ventana de fin del juego si está visible
    gameOverWindow.style('display', 'none');

    // Detener el cronómetro
    clearInterval(countdownInterval); // Detener el cronómetro
    timer.html('Tiempo: 30'); // Resetear el tiempo mostrado
    timer.style('display', 'none'); // Ocultar el temporizador
}
