
class Nodo {
  constructor(x, y, label) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.selected = false;
  }

  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
  }

  draw() {
    if(this.selected){
      strokeWeight(4);
      stroke(51);
    }
    ellipse(this.x, this.y, 20, 20);
    fill(0);
    strokeWeight(1);
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

  