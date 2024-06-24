
class Edge {
  constructor(source, target, explicacion) {
    this.source = source;
    this.target = target;
    this.explicacion = explicacion;
    this.selected = false;
    this.visible = true;
  }

  isMouseOver(x, y) {
    const buffer = 0.01; // margen de error para la detección
    let d1 = dist(x, y, this.source.x, this.source.y);
    let d2 = dist(x, y, this.target.x, this.target.y);
    let lineLen = dist(this.source.x, this.source.y, this.target.x, this.target.y);
    return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
  }

  draw() {
    if (this.visible) { // Dibuja solo si es visible
      strokeWeight(this.selected ? 4 : 1);
      drawArrow(this.source.x, this.source.y, this.target.x, this.target.y);
    }
  }
}