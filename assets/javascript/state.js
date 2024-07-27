

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


//se crea una copia nueva "nuevoGrafo", se añade un nodo a la copia, 
// la copia se añade a la lista de estados y la copia se convierte en el
//grafo operativo
function addNode(estado, nodo){
        let nuevoGrafo = estado.graph.addNode(nodo); 
        listOfStates.push(nuevoGrafo);
        estado.graph = nuevoGrafo;
    }

    
    