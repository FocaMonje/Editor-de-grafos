
class Node  {           //extends toxi.physics2d.VerletParticle2D
  constructor(label, size, year) {
    //super(x, y);
    this.label = label;
    this.selected = false;
    this.size = size;
    this.year = year;
    this.visible = true;
    this.valencia = 0;
  }

  display() {
    if (this.visible) {
      noStroke();
      fill(255, 0, 0);

      let intevaloVal = Math.floor(canvas_height / maxVal);
      let x = this.year;
      let y = canvas_height - this.valencia * intevaloVal;
      let r = this.size;
      ellipse(x, y , r * (r/(r * zoomX) ), r * (r/(r * zoomY)));
      fill(0);
      textSize(12);
      textAlign(CENTER, CENTER);
      text(this.label, x, y);
    }
  }

  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
  }

  draw(size) {
    if (this.visible) { // Solo dibuja si el nodo es visible
      this.size = size;
      if (this.selected) {
          strokeWeight(4);
          stroke(51);
      }
      
      let intevaloVal = Math.floor(canvas_height / maxVal);
      let x = this.year;
      let y = canvas_height - this.valencia * intevaloVal;
      let r = this.size;
      ellipse(x, y , r * (r/(r * zoomX) ), r * (r/(r * zoomY)));

      fill(0);
      strokeWeight(1);
      textAlign(CENTER, CENTER);
      textSize(this.size);
      text(this.label, this.x, this.y);
      fill(255);
    }
  }

  setVisible(visible) {
    this.visible = visible;
  }

  isMouseOver(mouseXAdj, mouseYAdj) {
    return dist(mouseXAdj, mouseYAdj, this.x, this.y) < 10;
  }

  updateState(currentTime) {
    this.isVisible = this.year <= currentTime;
  }

  move(fx, fy) {
    this.x -= fx / 2;
    this.y -= fy / 2;
  }
}
