
  function prepareDataForGraphics(grafo) {
   
    let inventos = grafo.nodes.sort((a, b) => a.year - b.year);
    
    for (let i = 0; i < inventos.length; i++) {
      inventos[i].valencia = 0;
      inventos[i].flechas = [];
    }
  
    let enlaces = grafo.links;
    
    for (let i = 0; i < enlaces.length; i++) {
      let inv_padre_id = enlaces[i].source;
      let inv_hijo_id = enlaces[i].target;
      
      for (let j = 0; j < inventos.length; j++) {
        if (inventos[j].id === inv_padre_id) {
          inventos[j].valencia += 1;
          inventos[j].flechas.push(inv_hijo_id);
        }
      }
    }
   
    return inventos;
  }
  