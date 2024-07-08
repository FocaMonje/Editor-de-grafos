
function enterGameMode2() {
    workMode = "gameMode2";
    const button = document.getElementById('gameMode2Button');
    button.textContent = 'Exit Game Mode 2'; // Cambiar texto del botón

    // Ocultar el botón "Show Solution"
    document.getElementById('solutionButton').style.display = 'none';

    document.getElementById('info').style.display = 'block';

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
            endGame2();
        }
    }, 1000);

    // Nodos más conectados
    const highlyConnectedNodes = ["La imprenta", "La pila", "El sistema métrico", "El cañon", "La goma elástica"];
    
    // Seleccionar un nodo aleatorio entre los más conectados
    const selectedMainNode = highlyConnectedNodes[Math.floor(Math.random() * highlyConnectedNodes.length)];
    const mainNode = nodes.nodes.find(node => node.label === selectedMainNode);

    // Encontrar nodos conectados al nodo seleccionado
    const connectedNodes = graphManager.edges.edges
        .filter(edge => edge.source === mainNode || edge.target === mainNode)
        .map(edge => edge.source === mainNode ? edge.target : edge.source);

    // Seleccionar nodos aleatorios conectados al nodo principal
    selectedNodes = [mainNode];
    while (selectedNodes.length < 20 && connectedNodes.length > 0) {
        const randomIndex = Math.floor(Math.random() * connectedNodes.length);
        selectedNodes.push(connectedNodes.splice(randomIndex, 1)[0]);
    }

    // Mostrar solo los nodos seleccionados
    nodes.nodes.forEach(node => {
        node.setVisible(selectedNodes.includes(node));
        console.log(`Nodo ${node.label} visible: ${node.visible}`);
    });

    // Ocultar todas las aristas
    graphManager.edges.edges.forEach(edge => {
        edge.visible = false;
    });
}

function exitGameMode2() {
    workMode = "drawMode";
    const button = document.getElementById('gameMode2Button');
    button.textContent = 'Game Mode 2'; // Restaurar texto original del botón

    // Ocultar el botón "Show Solution"
    document.getElementById('solutionButton').style.display = 'none';

    document.getElementById('info').style.display = 'none';

    hideScore();

    // Mostrar los controles y habilitar la creación de nodos
    slider_node_size.removeAttribute('disabled');
    labelInput.removeAttribute('disabled');

    // Restaurar la visibilidad de los nodos y las aristas
    nodes.nodes.forEach(node => {
        node.setVisible(true);
    });

    graphManager.edges.edges.forEach(edge => {
        edge.visible = true; // Implementar la lógica de visibilidad
    });

    // Detener el cronómetro
    clearInterval(countdownInterval);
    timer.html('Tiempo: 30'); // Resetear el tiempo mostrado
    timer.style('display', 'none'); // Ocultar el temporizador
}

function endGame2() {
    clearInterval(countdownInterval);
    let points = evaluateScorePoints();
    displayScore2(points);

    // Verificar si se encontraron todas las flechas
    let allEdgesVisible = graphManager.edges.edges.every(edge => edge.visible);

    if (!allEdgesVisible) {
        document.getElementById('solutionButton').style.display = 'block'; // Mostrar el botón "Show Solution" si no se encontraron todas las flechas
    }
}

function checkGameCompletion2() {
    // Verificar si todas las flechas correspondientes a los nodos seleccionados están visibles
    let allEdgesVisible = graphManager.edges.edges.every(edge => {
        return (!selectedNodes.includes(edge.source) || !selectedNodes.includes(edge.target)) || edge.visible;
    });

    // Si todas las flechas están visibles, mostrar la ventana de fin del juego
    if (allEdgesVisible) {
        document.getElementById('solutionButton').style.display = 'none'; // Ocultar el botón "Show Solution"
        document.getElementById('info').style.display = 'none';
    } 
}

function displayScore2(points) {
    scoreDisplay.html(`Puntuación: ${points}`); // Mostrar la puntuación en el elemento HTML correspondiente
    scoreDisplay.style('display', 'block'); // Asegurarse de que el elemento sea visible
    document.getElementById('solutionButton').style.display = 'block'; // Mostrar el botón "Show Solution"
}

// Función para mostrar la solución
function showSolution() {
    // Mostrar todas las flechas correspondientes a los nodos seleccionados
    graphManager.edges.edges.forEach(edge => {
        if (selectedNodes.includes(edge.source) && selectedNodes.includes(edge.target)) {
            edge.visible = true; // Mostrar la flecha si ambos nodos están seleccionados
        }
    });
    selectedNodes.forEach(node => {
        node.setVisible(true); // Mostrar todos los nodos seleccionados
    });
}
