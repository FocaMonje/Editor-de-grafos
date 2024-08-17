
class Edge {
  constructor(source, target, explicacion = '') {
    if (typeof explicacion === 'string' && explicacion.length <= 0){
      this.explicacion = "Edge " + state.graph.edges.edgeCounter;
    } else if((typeof explicacion === 'string' && explicacion.length > 0)){
      this.explicacion = explicacion;
    } else {
      console.log("Error en los argumentos del constructor de Edge");
    }
    this.source = source;
    this.target = target;
    this.selected = false;
    this.visible = true;
  }

  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
  }

  isPointInsideNode(x, y, node) {
    let distance = dist(x, y, node.x, node.y);
    return distance <= node.size / 2;
  }

  isMouseOver(x, y) {
    const margin = 0.4; // margen para ampliar la zona de selección

    let x1 = this.source.x;
    let y1 = this.source.valencia;
    let x2 = this.target.x;
    let y2 = this.target.valencia;

    // Verificar si el punto está dentro del nodo de origen o destino
    if (this.isPointInsideNode(x, y, this.source) || this.isPointInsideNode(x, y, this.target)) {
      return false;
    }

    // Calcular la distancia perpendicular desde (x, y) a la línea
    let distToLine = abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / dist(x1, y1, x2, y2);

    // Si la distancia es menor que el margen 
    if (distToLine <= margin) {
      return true;
    }

    return false;
  }

  draw() {
    if (this.visible) { // Dibuja solo si es visible
      strokeWeight(this.selected ? 4 : 1);

      let coordsSource = 0;
      let coordsTarget = 0;

      if (state.mode == "timeLineMode"){
        coordsSource = {x: this.source.xGame, y: this.source.yGame};
        coordsTarget = {x: this.target.xGame, y: this.target.yGame};
        
       }
       if (state.mode == "editorMode"){
        coordsSource = coordRealesCanvas(this.source.year, this.source.valencia);
        coordsTarget = coordRealesCanvas(this.target.year, this.target.valencia);
         
       }
       if (state.mode == "animationMode"){
         
       }
       
      this.drawArrow(coordsSource.x, coordsSource.y, coordsTarget.x, coordsTarget.y, this.source.size/3);
    }
   
  }


  drawArrow(x1, y1, x2, y2,arrowSize) {

    let arrowLength = dist(x1, y1, x2, y2) - arrowSize * 2; // Longitud del cuerpo de la flecha
    arrowLength /= 1.1; // Reducimos el tamaño del cuerpo de la flecha
    let arrowAngle = atan2(y2 - y1, x2 - x1); // Para orientar la flecha en la dirección adecuada

    push();
    translate(x1, y1);
    rotate(arrowAngle);
    
    var c = 0;

    if (this.explicacion == state.graph.edgesUnderMouse) {
      c = 80;
      
    } else{
      c = 180;
    }

    strokeWeight(this.selected ? 5 : 2);
    stroke(c);

    line(0, 0, arrowLength, 0);
    // Dibujar la punta de la flecha
    translate(arrowLength, 0);
    fill(c);
    triangle(0, arrowSize , 0, -arrowSize , arrowSize, 0);
    pop();
  }
}