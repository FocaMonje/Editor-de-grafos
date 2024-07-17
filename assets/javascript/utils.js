
// function mouseDragged() {
//   let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
//   let mouseXAdj = (mouseX - centerX - controls.view.x) / zoomFactor + centerX;
//   let mouseYAdj = (mouseY - centerY - controls.view.y) / zoomFactor + centerY;

//   if (draggingNode) {
//       draggingNode.x = mouseXAdj;
//       draggingNode.y = mouseYAdj;
//       activeGraph.prepareJSONObject();
//   } else {
//       draggingNode = activeNodes.findNode(mouseXAdj, mouseYAdj);
//   }
// }

function mouseReleased() {
  draggingNode = null;
}

function modifyNodeName() {
  let node = activeNodes.nodeSelected;
  if (node) {
      node.label = labelInput.value();
  }
}

function doZoom(event) {
    const direction = event.deltaY > 0 ? -1 : 1;
    const factor = 0.05;
    const zoom = direction * factor;
  
    const wx = (mouseX - controls.view.x) / (width * controls.view.zoom);
    const wy = (mouseY - controls.view.y) / (height * controls.view.zoom);
  
    controls.view.x -= wx * width * zoom;
    controls.view.y -= wy * height * zoom;
    controls.view.zoom += zoom;
}

function resetButtonStyles() {
    drawModeButton.style('background-color', '');
    deleteModeButton.style('background-color', '');
    animationModeButton.style('background-color', '');
    gameModeButton.style('background-color', '');
    hideAnimationControls();
}

function moveView(deltaX, deltaY) {
    // Actualizar el desplazamiento para el canvas
    scrollX -= deltaX;
    scrollY -= deltaY;

    // Ajustar la vista del canvas
    translate(deltaX, deltaY);
    
    // Redibujar el canvas
    redraw();
    
    // activeGraph.prepareJSONObject(); // Actualizar el grafo
}

function modifyEdgeInfo(){
    let edge = activeGraph.edges.selectedEdge;
    if (edge) {
        edge.explicacion = edgeInput.value();
    }
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function centerCanvas(cnv) {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function draw_grid(w, h){

    let colorGrid = color(0,150,150);
  
    push();
    for (let i = initYear; i < lastYear; i += 100){
      colorGrid.setAlpha(75);
      stroke(colorGrid);
      line(i, 0, i, h);
      fill(colorGrid);
      textSize(16);
      if (i == initYear) continue;
      text(str(i), i + 20, h - 20);
    }
    
    let cont = 0;
    for (let i = alturaDibujo; i > 0; i -= Math.floor(alturaDibujo / maxVal)){
      colorGrid.setAlpha(75);
      stroke(colorGrid);
      line(initYear +  35 ,i, initYear + lastYear, i);
      fill(colorGrid);
      textSize(12);
      text(str(maxVal - cont + 1), initYear+ 20, alturaDibujo - i  + 15);
      cont += 1;
    }
    
    pop();
   
}

function indiceDeInvento(invento_id, arrayInventos){
    
    for (let i = 0; i < arrayInventos.length; i += 1){
      if(invento_id === arrayInventos[i].id)
        return i;
    }
    return -1;
    
}

  
function coordCanvasReales(canvasX, canvasY){

    
    const realX = (canvasX - scrollX) * 1/zoomX ;
    let realY = (canvasY - scrollY) * 1/zoomY;
    
    realY = (2 * (alturaDibujo - realY) / maxVal) + 1;

    
    return {x:realX, y:realY};
    
}

function updateIncreaseX() {
    zoomX += 0.05;
    redraw();
}

function updateDecreaseX() {
    zoomX  -= 0.05;
    redraw();
}

function updateIncreaseY() {
    zoomY += 0.05;
    redraw();
}

function updateDecreaseY() {
    zoomY  -= 0.05;
    redraw();
}

// Función para manejar las teclas presionadas
function keyPressed() {
    switch (key) {
      case 'q':
        zoomX = 1;
        zoomY = 1;
        scrollX = -1 * initYear;
        scrollY = 0;
        break;
      case 'z':
        zoomX -= 0.05;
        scrollX += 75;
        break;
      case 'x':
        zoomX += 0.05;
        scrollX -= 75;
        break;
      case 'd':
        zoomY += 0.05;
        break;
      case 'c':
        zoomY -= 0.05;
        break;
    }

}
  