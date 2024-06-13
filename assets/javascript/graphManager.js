
function saveGraph(nodes, edges) {
    let graph = {
      directed: true,
      graph: {},
      nodes: nodes.nodes.map((node, index) => ({ id: `N${index + 1}` })),
      links: edges.map(edge => ({
        source: `N${nodes.nodes.indexOf(edge[0]) + 1}`,
        target: `N${nodes.nodes.indexOf(edge[1]) + 1}`
      })),
      multigraph: false
    };
    saveJSON(graph, 'graph.json');
  }
  
  function loadGraph(callback) {
    let input = createFileInput(file => handleFile(file, callback));
    input.hide();
    input.elt.click();
  }
  
  function handleFile(file, callback) {
    if (file.type === 'application' && file.subtype === 'json') {
      try {
        let graph = JSON.parse(file.data);
        callback(graph);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }
  