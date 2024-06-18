
class Edge {
  constructor(source, target, explicacion) {
    this.source = source;
    this.target = target;
    this.explicacion = explicacion;
    this.selected = false;
  }

  isMouseOver(x, y) {
    const buffer = 0.01; // margen de error para la detección
    let d1 = dist(x, y, this.source.x, this.source.y);
    let d2 = dist(x, y, this.target.x, this.target.y);
    let lineLen = dist(this.source.x, this.source.y, this.target.x, this.target.y);
    return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
  }

  draw() {
    strokeWeight(this.selected ? 4 : 1);
    drawArrow(this.source.x, this.source.y, this.target.x, this.target.y);
  }
}

function drawArrow(x1, y1, x2, y2) {
  let arrowSize = 10; // Tamaño de la punta de la flecha
  let arrowLength = dist(x1, y1, x2, y2) - arrowSize * 2; // Longitud del cuerpo de la flecha
  arrowLength /= 1.1; // Reducimos el tamaño del cuerpo de la flecha
  let arrowAngle = atan2(y2 - y1, x2 - x1); // Para orientar la flecha en la dirección adecuada
  push();
  translate(x1, y1);
  rotate(arrowAngle);
  // Dibujar el cuerpo de la flecha
  line(0, 0, arrowLength, 0);
  // Dibujar la punta de la flecha
  translate(arrowLength, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}