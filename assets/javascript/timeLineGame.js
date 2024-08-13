
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
    // countdown = 30; // Reiniciar el tiempo del cronómetro
    // const timerElement = document.getElementById('timer'); // Asegúrate de que el ID es correcto
    // if (timerElement) {
    //     timerElement.textContent = 'Tiempo: ' + countdown; // Mostrar el tiempo inicial
    //     timerElement.style.display = 'block'; // Asegúrate de que el temporizador esté visible
    // }

    // countdownInterval = setInterval(() => {
    //     countdown--;
    //     if (timerElement) {
    //         timerElement.textContent = 'Tiempo: ' + countdown;
    //     }
    //     if (countdown <= 0) {
    //         clearInterval(countdownInterval);
    //         endGame();
    //     }
    // }, 1000);


     // Ocultar todos los nodos y mostrar solo los seleccionados para el juego
     state.graph.nodes.setAllNodesInvisible();

    // Seleccionar 6 nodos al azar y mostrarlos
    let allNodes = state.graph.nodes.nodesList;
    console.log("allNodes: ", allNodes);

    let contador = 0;
    while (contador < state.numNodesGame) {
        const randomIndex = Math.floor(randomIntFromInterval(0,allNodes.length - 1));
        const selectedNode = allNodes.slice(randomIndex, randomIndex + 1)[0];  //allNodes.splice(randomIndex,  1);

        // Mira de no seleccionar dos veces el mismo nodo
        let nodoYaSeleccionado = false;
        for ( node_ of state.gameNodes){
            if(node_.label == selectedNode.label ){
                nodoYaSeleccionado = true;
            }
        }
        if (nodoYaSeleccionado == true){
            nodoYaSeleccionado = false;
            continue;
        }
        // Marca el nodo como seleccionado , lo hace visible y lo guarda en state.gameNodes 
        for ( node of state.graph.nodes.nodesList){
            if(node.label == selectedNode.label && node.visible == false){
                
                contador += 1;
                if(contador > 10){
                    break;
                }
                node.visible = true;
                state.gameNodes.push(node);
                state.gameNodes.sort((a, b) => a.year - b.year);
                console.log (state.gameNodes);
            }
        }
    }
    // Distribuye los nodos en pantalla sin que se toquen
    const espaciado = 150;
    var nodosEspaciados = [];
    var ind = 0;

    while( nodosEspaciados.length < state.gameNodes.length){
        var nodo = state.gameNodes[ind];
        nodo.xGame = randomIntFromInterval(1200, 1900);
        nodo.yGame = randomIntFromInterval(40, 400);

        // ¿Se superpone a otro nodo?
        var overlapping = false;
        for ( var i = 0; i < nodosEspaciados.length; i++  ){
            var otroNodo = nodosEspaciados[i];
            var d = dist(nodo.xGame, nodo.yGame, otroNodo.xGame, otroNodo.yGame);
            if (d < espaciado) {
                overlapping = true;
              }
        }
         // If not keep it!
    if (!overlapping) {
        nodosEspaciados.push(nodo);
        ind += 1;
      }
    }
    
    state.selectedNode = {};
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

