
function setupYearSliders(graph) {
    let years = graph.nodes.map(node => node.year);
    let minYear = Math.min(...years);
    let maxYear = Math.max(...years);

    minYear = Math.max(minYear, 1000);
    maxYear = Math.min(maxYear, 3000);

    slider_start_year.attribute('min', 1000); 
    slider_start_year.attribute('max', 3000); 
    slider_start_year.value(minYear);

    slider_end_year.attribute('min', 1000); 
    slider_end_year.attribute('max', 3000); 
    slider_end_year.value(maxYear);

    animationSettings.startYear = minYear;
    animationSettings.endYear = maxYear;

    select('#start_year_value').html(minYear);
    select('#end_year_value').html(maxYear);
}

function startAnimation() {
    if (workMode === 'animationMode') {
        isAnimating = true;
        if (animationInterval) clearInterval(animationInterval);
        
        let currentYear = animationSettings.startYear;
        let endYear = animationSettings.endYear;
        
        // Iterar a través de los nodos para mostrar solo aquellos en el rango de años seleccionado
        nodes.nodes.forEach(node => {
            node.visible = node.year >= currentYear && node.year <= endYear;
        });

        animationInterval = setInterval(() => {
            graphManager.updateGraph(); // Para actualizar el grafo con los cambios en la visibilidad
            currentYear++;
            if (currentYear > endYear) {
                clearInterval(animationInterval);
                isAnimating = false;
            }
        }, 1000); // Intervalo de 1 segundo (1000 ms) para cada año
    }
}

function animateNodes(currentYear, endYear) {
    nodes.nodes.forEach(node => {
        node.visible = node.year >= currentYear && node.year <= endYear;
    });
    graphManager.updateGraph(); 
}

function showAnimationControls() {
    select('#animation-controls').style('display', 'block');
}

function hideAnimationControls() {
    select('#animation-controls').style('display', 'none');
}