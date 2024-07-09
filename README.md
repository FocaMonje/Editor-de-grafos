# Editor-de-grafos
The idea would be to make a graph editor that would help us with the analysis of innovation graphs and then help us to develop a game on these topics.
web model : https://csacademy.com/app/graph_editor/
Some useful pages : 

https://p5js.org/reference/#/p5/saveJSON 

https://p5js.org/reference/#/p5/createButton 

https://p5js.org/reference/#/p5/createFileInput 

https://p5js.org/reference/#/p5/select 

https://esdocu.dev/javascript/funciones-orden-superior#sort

Cosas hechas:
1. Game Mode 2 implementado correctamente con pequeño error (aunque se encuentren todas las flechas el texto: Te faltan flechas por encontrar, sigue apareciendo).
2. En basicGame.js están las funciones comunes a los juegos.
3. En gameTest.js está el testeo de las funcionalidades deseadas para el modo juego con grafo sencillo.
4. En game.js está el juego de averiguar las conexiones entre los nodos.
5. Time Line funciona con algunos errores, las flechas son muy claras y apenas se ven. Al salir de Time Line las flechas se siguen mostrando en el grafo. Los nodos están muy juntos y eso hace que sea difícil jugar.
6. En Time Line las flechas se crean desde el nodo más antiguo al nodo más reciente.
