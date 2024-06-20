
class Nodo extends toxi.physics2d.VerletParticle2D {
  constructor(x, y, label, size) {
    super(x, y);
    this.x = x;
    this.y = y;
    this.label = label;
    this.selected = false;
    this.size = size;
  }

  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
  }

  draw(size) {
    this.size = size;
    if (this.selected) {
      strokeWeight(4);
      stroke(51);
    }
    ellipse(this.x, this.y, this.size, this.size);
    fill(0);
    strokeWeight(1);
    textAlign(CENTER, CENTER);
    textSize(this.size);
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
