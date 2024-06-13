
class Nodo {
  constructor(x, y, label) {
    this.x = x;
    this.y = y;
    this.label = label;
  }

  draw() {
    fill(255);
    stroke(0);
    ellipse(this.x, this.y, 20, 20);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }
} 