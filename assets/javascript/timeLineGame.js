
function enterTimeLineMode() {
    
    // const button = document.getElementById('modeDropdown');
    // button.textContent = 'Exit Time Line Mode'; // Cambiar texto del botón

    // Ocultar las flechas (edges) y asegurar que los nodos sean visibles
    state.graph.edges.edgesList.forEach(edge => {
        edge.visible = false; // Ocultar todas las flechas
    });

    // Ocultar la ventana de fin del juego si está visible
    const gameOverWindow = document.getElementById("game-over-window");
    if (gameOverWindow) {
        gameOverWindow.style.display = 'none'; // Asegúrate de que esta línea está correcta
    }

    // Iniciar el cronómetro
    countdown = 30; // Reiniciar el tiempo del cronómetro
    const timerElement = document.getElementById('timer'); // Asegúrate de que el ID es correcto
    if (timerElement) {
        timerElement.textContent = 'Tiempo: ' + countdown; // Mostrar el tiempo inicial
        timerElement.style.display = 'block'; // Asegúrate de que el temporizador esté visible
    }

    countdownInterval = setInterval(() => {
        countdown--;
        if (timerElement) {
            timerElement.textContent = 'Tiempo: ' + countdown;
        }
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000);


     // Ocultar todos los nodos y mostrar solo los seleccionados para el juego
     state.graph.nodes.setAllNodesInvisible();

    // Seleccionar 6 nodos al azar y mostrarlos
    const allNodes = [...state.graph.nodes.nodesList];

    let contador = 0;
    while (contador < 5) {
        contador += 1;
        const randomIndex = Math.floor(Math.random() * allNodes.length);
        const selectedNode = allNodes.splice(randomIndex, 1)[0];
        for ( node of state.graph.nodes.nodesList){
            if(node.label == selectedNode.label){
                node.visible = true;
            }
        }
    }

    state.graph.prepareJSONObject(); // Actualizar el gráfico
}



function exitTimeLineMode() {
    state.mode = "editorMode";
    // const button = document.getElementById('modeDropdown');
    // button.textContent = 'Time Line'; // Restaurar texto original del botón

    hideScore();
    
    // Mostrar los controles y habilitar la creación de nodos
    slider_node_size.removeAttribute('disabled');
    labelInput.removeAttribute('disabled');

      // Restaurar la visibilidad de las flechas y los nodos
      state.graph.edges.edgesList.forEach(edge => {
        edge.visible = true; 
    });
    state.graph.nodes.nodesList.forEach(node => {
        node.visible = true;
    });
    state.graph.prepareJSONObject(); // Actualizar el gráfico

    // Mostrar la ventana de fin del juego si está visible
    const gameOverWindow = document.getElementById("game-over-window");
    if (gameOverWindow) {
        gameOverWindow.style.display = 'block'; // Restaurar visibilidad si es necesario
    }

    // Detener el cronómetro
    clearInterval(countdownInterval); // Detener el cronómetro
    const timerElement = document.getElementById('timer'); // Asegúrate de que el ID es correcto
    if (timerElement) {
        timerElement.textContent = 'Tiempo: 30'; // Resetear el tiempo mostrado
        timerElement.style.display = 'none'; // Ocultar el temporizador
    }
}

