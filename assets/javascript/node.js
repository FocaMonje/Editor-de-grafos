
class Node  {          
  constructor(year, valencia, label) {
    if (typeof year === 'number' && typeof valencia === 'number' && typeof label === 'string'){
      this.label = label;
      this.year = year;
      this.valencia = valencia;
    }else if (typeof year === 'number' && typeof valencia === 'string') {
      this.label = valencia;
      this.year = year;
      this.valencia = 0;
    }else if (typeof year === 'number' && typeof valencia === 'number') {
      this.label = "Nodo " + state.graph.nodes.nodeCounter;
      this.year = year;
      this.valencia = valencia;
    } else {
      console.log("Error en los argumentos del constructor de Node");
    }
    this.selected = false;
    this.size = 50;
    this.visible = true;

    this.xGame = abs(scrollX) + random(canvas_width);
    this.yGame = scrollY + random(canvas_height - 100);
    
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
 
      let r = 20;

      let x = 0;
      let y = 0;

      if (state.mode == "timeLineMode"){
        x = this.xGame;
        y = this.yGame;
        textAlign(CENTER, CENTER);
        textSize(this.size);
        fill(0);
        text(this.label, this.xGame, this.yGame + r / 2 + this.size / 2);  // para desplazar el texto hacia abajo
        stroke(0);
        
      }
      if (state.mode == "editorMode"){
        x = this.x;
        y = this.y;
      }
      if (state.mode == "animationMode"){
        x = animate(x, this.xGame, this.x, animationDuration);
        y = animate(y, this.yGame, this.y, animationDuration);
        textAlign(CENTER, CENTER);
        textSize(this.size);
        fill(0);
        text(this.label, x, y + r / 2 + this.size / 2);
        stroke(0);
        
      }
      if (state.mode == "solutionMode"){
        x = this.x;
        y = this.y;
        textAlign(CENTER, CENTER);
        textSize(this.size);
        fill(0);
        text(this.label, x, y + r / 2 + this.size / 2);
        stroke(0);
      }

      if (this.label==state.selectedNode.label) {
        strokeWeight(6);
        stroke(51);
      }

      for (let node of state.nodesUnderMouse){
        if(this.label == node.label){
          strokeWeight(4);
          stroke(51);
        }
      }
        
      fill(255);
      ellipse(x, y , r * (r/(r * zoomX) ), r * (r/(r * zoomY)));
   
      fill(0);
      strokeWeight(1);
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
