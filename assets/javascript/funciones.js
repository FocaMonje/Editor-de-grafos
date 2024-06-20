
function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
      let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
      let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;
  
      switch (workMode) {
        case 'drawMode': {
          let node = nodes.findNode(mouseXAdj, mouseYAdj);
          if (node) {
            if (nodes.nodeSelected !== null && nodes.nodeSelected !== node) {
              graphManager.addEdge(nodes.nodeSelected, node); // No se pide info
              physics.addSpring(new VerletSpring2D(nodes.nodeSelected, node, 100, 0.01));
              nodes.unSelectNodes();
            } else if (nodes.nodeSelected === null && node.selected === false) {
              nodes.selectNode(node);
              label.value(node.label);
            }
          } else if (nodes.nodeSelected != null) {
            nodes.unSelectNodes();
          } else {
            let edge = graphManager.edges.findEdge(mouseXAdj, mouseYAdj);
            if (!edge) {
              let newNode = nodes.addNode(mouseXAdj, mouseYAdj);
              newNode.label = nodeCounter.toString();
              nodeCounter++;
            }
          }
          break;
        }
        case 'deleteMode': {
          let edge = graphManager.edges.findEdge(mouseXAdj, mouseYAdj);
          if (edge) {
            graphManager.edges.removeEdge(edge);
            return;
          }
  
          let node = nodes.findNode(mouseXAdj, mouseYAdj);
          if (node) {
            nodes.removeNode(node);
            graphManager.removeEdgesConnectedToNode(node);
          }
          break;
        }
      }
    }
  }
  

  function mouseDragged() {
    let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
    let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
    let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;
  
    if (draggingNode) {
      draggingNode.x = mouseXAdj;
      draggingNode.y = mouseYAdj;
      graphManager.updateGraph();
    } else {
      draggingNode = nodes.findNode(mouseXAdj, mouseYAdj);
    }
  }
  
  function mouseReleased() {
    draggingNode = null;
  }
  
  function modifyNodeName(){
    node = nodes.nodeSelected;
    if (node) {
      node.label = label.value();
    }
  }