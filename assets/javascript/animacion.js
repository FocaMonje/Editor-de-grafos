
/* ------------------- GAME ANIMATION ----------------------------------*/

function initNodeAnimation(){
    animationStart = millis();
    state.mode = "animationMode";
    setTimeout( function() { state.mode = "solutionMode"; }, animationDuration);
  }
  
function animate(y, y1, y2, interval){

// map our keyframe time https://p5js.org/reference/p5/map/
t = map(millis(), animationStart, animationStart + interval, 0.0, 1.0);
// use the time to average our two points
y = y1 * (1 - t) + y2 * t;
return y;
}

function initGridAnimation(){
    genAlpha = alphaMaker();
    draw_grid(width, height, genAlpha.next().value);
}


function* alphaMaker() {
    let alpha = 0;
    while (alpha < 255) {
      if(alpha == 254 ){
        alpha = 0;
      }
      yield alpha++;
    }
  }
  
  





/*---------------- GRAPH EDITOR ANIMATION ------------------------------- */


function setupYearSliders(graph) {
    let years = graph.nodes.map(node => node.year);
    let minYear = Math.min(...years);
    let maxYear = Math.max(...years);

    minYear = Math.max(minYear, 1000);
    maxYear = Math.min(maxYear, 2024);

    slider_start_year.attribute('min', 1000); 
    slider_start_year.attribute('max', 2024); 
    slider_start_year.value(minYear);

    slider_end_year.attribute('min', 1000); 
    slider_end_year.attribute('max', 2024); 
    slider_end_year.value(maxYear);

    animationSettings.startYear = minYear;
    animationSettings.endYear = maxYear;

    select('#start_year_value').html(minYear);
    select('#end_year_value').html(maxYear);

    currentYearIndex = 0; // Reiniciar el índice del año actual
}

function stopAnimation() {
    if (isAnimating) {
        clearInterval(animationInterval);
        isAnimating = false;
        
        // Mostrar el botón de inicio y ocultar el botón de detener
        startButton.hide();
        stopButton.hide();
        restartButton.show();
    }
}

function stopAnimationEndInterval() {
    if (isAnimating) {
        clearInterval(animationInterval);
        isAnimating = false;
        
        // Mostrar el botón de inicio y ocultar el botón de detener
        startButton.show();
        stopButton.hide();
        restartButton.hide();
    }
}

function startAnimation() {
    if (workMode === 'animationMode') {
        isAnimating = true;
        if (animationInterval) clearInterval(animationInterval);

        // Obtén los años únicos y ordenados
        let uniqueYears = activeGraph.getUniqueSortedYears();

        // Filtra los años dentro del rango seleccionado
        uniqueYears = uniqueYears.filter(year => year >= animationSettings.startYear && year <= animationSettings.endYear);

        let currentYearIndex = 0;
        let endYearIndex = uniqueYears.length - 1;

        // Inicialmente ocultar todos los nodos y aristas
        nodes.setAllNodesInvisible();
        activeGraph.edges.edgesList.forEach(edge => edge.visible = false);

        // Ocultar el botón de inicio y mostrar el botón de detener
        startButton.hide();
        stopButton.show();
        restartButton.hide(); 

        animationInterval = setInterval(() => {
            if (currentYearIndex <= endYearIndex) {
                let currentYear = uniqueYears[currentYearIndex];

                // Mostrar los nodos y aristas dentro del rango de años
                nodes.nodes.forEach(node => {
                    if (node.year <= currentYear && node.year >= animationSettings.startYear) {
                        node.setVisible(true);
                        graphManager.edges.edges.forEach(edge => {
                            if ((edge.source === node || edge.target === node) &&
                                edge.source.year <= currentYear &&
                                edge.target.year <= currentYear) {
                                edge.visible = true;
                            }
                        });
                    }
                });

                activeGraph. prepareJSONObject(); // Actualiza el grafo con los cambios en la visibilidad
                currentYearIndex++;
            } else {
                stopAnimationEndInterval(); // Llama a stopAnimationEndInterval cuando termine la animación
            }
        }, 1000); // Intervalo de 1 segundo (1000 ms) para cada año
    }
}

function restartAnimation() {
    if (workMode === 'animationMode' && !isAnimating) {
        // Inicializar el intervalo de animación desde el último año reproducido
        isAnimating = true;
        if (animationInterval) clearInterval(animationInterval);

        let uniqueYears = graphManager.getUniqueSortedYears();
        uniqueYears = uniqueYears.filter(year => year >= animationSettings.startYear && year <= animationSettings.endYear);

        let endYearIndex = uniqueYears.length - 1;

        // Ocultar el botón de reiniciar y mostrar el botón de detener
        restartButton.hide();
        startButton.hide();
        stopButton.show();

        animationInterval = setInterval(() => {
            if (currentYearIndex <= endYearIndex) {
                let currentYear = uniqueYears[currentYearIndex];

                nodes.nodes.forEach(node => {
                    if (node.year <= currentYear && node.year >= animationSettings.startYear) {
                        node.setVisible(true);
                        graphManager.edges.edges.forEach(edge => {
                            if ((edge.source === node || edge.target === node) &&
                                edge.source.year <= currentYear &&
                                edge.target.year <= currentYear) {
                                edge.visible = true;
                            }
                        });
                    }
                });

                graphManager.updateGraph();
                currentYearIndex++;
            } else {
                stopAnimationEndInterval();
            }
        }, 1000);
    }
}

function showAnimationControls() {
    select('#animation-controls').style('display', 'block');
}

function hideAnimationControls() {
    select('#animation-controls').style('display', 'none');
}