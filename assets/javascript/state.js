

class State {
    constructor() {
        let startNodes = new Nodes();
        let startEdges = new Edges();

        this.mode = "editorMode";     // Modos : "editorMode", "gameMode" , etc
        this.tool = "draw";       // Herramientas: "draw" , "delete"  
        this.graph = new GraphManager(startNodes, startEdges);
        this.selectedNode = {};
        this.selectedEdge = {};

        this.numNodesGame = 4;
        this.gameNodes = [];
        this.gameEdges = [];
        this.nodesUnderMouse = []
    }

    get modo(){
        return this.mode;
    }
    set modo(m){
        this.mode = m;
    }
    get herramienta(){
        return this.tool;
    }
    set herramienta(herr){
        this.tool = herr;
    }
    get grafo(){
        return this.graph;
    }
    set grafo(grafo){
        this.graph = grafo;
    }
    get nodoSeleccionado(){
        return this.selectedNode;
    }
    set nodoSeleccionado(nodo){
        this.selectedNode = nodo;
    }
    get arcoSeleccionado(){
        return this.selectedEdge;
    }
    set arcoSeleccionado(edge){
        this.selectedEdge = edge;
    }
    

}

// FUNCIONES QUE CAMBIAN EL ESTADO 

function addNode(estado, node){
   estado.graph.nodes.addNode(node.year, node.valencia, node.label);                       
}

function changeNode(estado, node , newLabel){
    estado.graph.nodes.changeNode(node.label, newLabel);
}

function deleteNode(estado, node){
   estado.graph.nodes.deleteNode(node);
} 

function addEdge(estado, node1, node2, explicacion = ''){
    estado.graph.addEdge(node1, node2, explicacion = '');                       
}

function changeEdge(estado, edge , newExplicacion){
    estado.graph.edges.changeEdge(edge.explicacion, newExplicacion);
}

function removeEdge(estado, edge){
    estado.graph.edges.removeEdge(edge);
} 