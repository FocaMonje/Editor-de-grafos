

class State {
    constructor() {
        let startNodes = new Nodes();
        let startEdges = new Edges();

        this.mode = "editor";     // Modos : "editor", "game" , "solution"
        this.tool = "draw";       // Herramientas: "draw" , "delete"  
        this.graph = new GraphManager(startNodes, startEdges);
        this.selectedNode = {};
        this.selectedEdge = {};
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

state = {
    modo: "editor",
    herramienta: "draw",
    graph: new GraphManager(new Nodes(), new Edges())
};

// FUNCIONES QUE CAMBIAN EL ESTADO 

function addNode(estado, nodo){
    estado.graph.addNode(nodo);
    // state.graph.nodes.nodeCounter += 1;                           
}

function changeNode(estado, nodo , newLabel){
    estado.graph.changeNode(nodo, newLabel); 
}

function deleteNode(estado, nodo){
    estado.graph.deleteNode(nodo); 
    state.graph.nodes.nodeCounter -= 1;
}    