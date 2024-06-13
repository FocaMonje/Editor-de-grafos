
class Nodo {
  constructor(x, y, label) {
    this.x = x;
    this.y = y;
    this.label = label;
  }

  draw() {
    ellipse(this.x, this.y, 20, 20);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
    fill(255);
  }

  isMouseOver(mouseXAdj, mouseYAdj) {
    return dist(mouseXAdj, mouseYAdj, this.x, this.y) < 10;
  }

  move(fx, fy) {
    this.x -= fx / 2;
    this.y -= fy / 2;
  }
}

  