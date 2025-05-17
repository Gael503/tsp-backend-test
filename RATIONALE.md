## Introducción

Para esta prueba primero tuve que entender el propósito de los componentes y cómo funcionaba el framework, con el fin de familiarizarme más con la estructura general del proyecto.

## ¿Qué vamos a hacer?

Uno de los primeros puntos fue implementar la lógica para generar un conjunto de ciudades con sus respectivas distancias, me apoyé en funciones auxiliares claras y separadas.

Analicé algunos algoritmos, como búsqueda en grafos, métodos de ordenamiento. al final use el **Vecino Más Cercano** (Nearest Neighbor) debido a que es facil de implementar y entender. Consideré también el **algoritmo genético**, pero por temas de tiempo y complejidad lo deje aun lado de momento.

El algoritmo del vecino más cercano consiste en comparar la ciudad actual con las demás ciudades no visitadas y moverse siempre a la ciudad más cercana (usando **distancia euclidiana**), hasta completar la ruta.

Este enfoque tiene la ventaja de ser rápido y relativamente fácil de implementar, aunque tiene la desventaja de no garantizar la ruta más óptima en todos los casos, especialmente con un número mayor de ciudades.

## Ajustes y pruebas

Primero instalé las dependencias y ejecuté los tests con `npm run test`. Algunos tests fallaban inicialmente debido a:

- Diferencias en los mensajes de error esperados.
- Errores menores en archivos como `world.ts` y `world-generator.ts`.
- Faltaba crar uno de los archivos.

Después de corregirlos, me enfoqué en hacer que los endpoints funcionaran. Tuve que modificar el `main.ts`, en particular el orden de configuración del prefijo global y los pipes de validación, para que las rutas respondieran correctamente.

## Estructura del código

- **TspSolver**: Clase que recibe un arreglo de ciudades y calcula todas las distancias posibles entre ellas.
  - `getAllDistances`: Retorna un objeto tipo `TspSolveRequestDto` con todas las ciudades y sus distancias.
  - `sortCities`: Fue un intento inicial para resolver el TSP de forma directa con rutas y costos, sin calcular todas las combinaciones posibles.

- **TspSolverWithDistances**: Clase que recibe el arreglo de ciudades con todas sus distancias previamente calculadas.
  - `solve`: Implementa el algoritmo del vecino más cercano para encontrar una ruta completa y su distancia total.

- **Calculator**: Clase que se encarga de calcular distancias entre ciudades.
  - `getDistances`: Aplica la fórmula euclidiana:  
    \\[
    d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
    \\]
  - `getDistanceWithRoute`: Busca en un arreglo de distancias la que conecta dos ciudades específicas.
  - `oldGetDistances`: Función usada principalmente en el método `sortCities` para probar rutas y registrar sus costos.

## Parte final

Me costó un poco implementar el código porque me gusta visualizar qué ocurre durante la ejecución, revisar errores, y confirmar que los datos están fluyendo correctamente.

Considero que la solución cumple con los requisitos de la prueba y pasa los tests correctamente. En el futuro, con más práctica, me gustaría implementar soluciones más eficientes como algoritmos genéticos o algoritmos de búsqueda más complejos que puedan dar mejores resultados para un número mayor de ciudades.