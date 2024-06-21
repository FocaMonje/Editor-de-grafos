
var colors = ['#008080', '#ADD8E6', '#61B2CB', '#2EA2D1'];


function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
        let mouseXAdj = (mouseX - centerX) / zoomFactor + centerX;
        let mouseYAdj = (mouseY - centerY) / zoomFactor + centerY;

      switch (workMode) {
            case 'drawMode': {
                let node = nodes.findNode(mouseXAdj, mouseYAdj, slider_node_size.value(), zoomFactor);
                if (node) {
                    if (nodes.nodeSelected !== null && nodes.nodeSelected !== node) {
                        graphManager.addEdge(nodes.nodeSelected, node);
                        nodes.unSelectNodes();
                    } else if (nodes.nodeSelected === null && node.selected === false) {
                        nodes.selectNode(node);
                        labelInput.value(node.label);
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
          case 'selectedMode': {
              let edge = graphManager.edges.findEdge(mouseXAdj, mouseYAdj);
              if (edge != null) {
                  graphManager.edges.selectEdge(edge);
                  edgeInput.value(edge.info);
              } else {
                    try {
                        graphManager.edges.unselectEdges();
                    } catch (e) {
                        console.log(e);
                    }             
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

function modifyNodeName() {
  let node = nodes.nodeSelected;
  if (node) {
      node.label = labelInput.value();
  }
}

function modifyEdgeInfo(){
  let edge = graphManager.edges.selectedEdge;
  if (edge) {
      edge.info = edgeInput.value();
  }
}

function updateZoom() {
  let slider_zoom = select('#slider_zoom');
  zoomSettings.zoom = slider_zoom.value();
}

function doZoom(event) {
    const direction = event.deltaY > 0 ? -1 : 1;
    const factor = 0.05;
    const zoom = direction * factor;
  
    const wx = (mouseX - controls.view.x) / (width * controls.view.zoom);
    const wy = (mouseY - controls.view.y) / (height * controls.view.zoom);
  
    controls.view.x -= wx * width * zoom;
    controls.view.y -= wy * height * zoom;
    controls.view.zoom += zoom;
}


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}