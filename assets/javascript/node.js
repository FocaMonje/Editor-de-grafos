
class Node  {          
  constructor(year, valencia, label) {
    if (typeof year === 'number' && typeof valencia === 'number' && typeof label === 'string'){
      this.label = label;
      this.year = year;
      this.valencia = valencia;
    } else if (typeof year === 'number' && typeof valencia === 'number') {
      this.label = "Nodo " + state.graph.nodes.nodeCounter;
      this.year = year;
      this.valencia = valencia;
    } else {
      console.log("Error en los argumentos del constructor de Node");
    }
    this.selected = false;
    this.size = 20;
    this.visible = true;
    
  }

  get x(){
      let coordenadas = coordRealesCanvas(this.year, this.valencia);
      return coordenadas.x;
  }

  get y(){
    let coordenadas = coordRealesCanvas(this.year, this.valencia);
    return coordenadas.y;
  }

  draw(size) {
    if (this.visible) { // Solo dibuja si el nodo es visible
      this.size = size;
      if (this.label==state.selectedNode.label) {
          strokeWeight(6);
          stroke(51);
      }

      for (let label of state.graph.nodesUnderMouse){
        if(this.label == label){
          strokeWeight(4);
          stroke(51);
        }
       }
 
      let r = 20;
      
      ellipse(this.x, this.y , r * (r/(r * zoomX) ), r * (r/(r * zoomY)));
   
      fill(0);
      strokeWeight(1);
      textAlign(CENTER, CENTER);
      textSize(this.size);
      //text(this.label, this.x, this.y);
      fill(255);
    }
  }


  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
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


  display() {
    if (this.visible) {
      noStroke();
      fill(255, 0, 0);
      let intevaloVal = Math.floor(canvas_height / maxVal);
      let r = this.size;
      ellipse(this.x, this.y , r * (r/(r * zoomX) ), r * (r/(r * zoomY)));
      fill(0);
      textSize(12);
      textAlign(CENTER, CENTER);
      text(this.label, x, y);
    }
  }
}
