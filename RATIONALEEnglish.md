## Introduction

For this test I first had to understand the purpose of the components and how the framework worked, in order to become more familiar with the overall structure of the project.

## What are we going to do?

One of the first points was to implement the logic to generate a set of cities with their respective distances, I relied on clear and separate auxiliary functions.

I analyzed some algorithms, such as graph search, sorting methods. In the end I used the **Nearest Neighbor** because it is easy to implement and understand. I also considered the **genetic algorithm**, but due to time and complexity issues I left it aside for the moment.

The Nearest Neighbor algorithm consists of comparing the current city with the other unvisited cities and always moving to the nearest city (using **Euclidean distance**), until completing the route.

This approach has the advantage of being quick and relatively easy to implement, although it has the disadvantage of not guaranteeing the most optimal route in all cases, especially with a larger number of cities.

## Settings and tests

First I installed the dependencies and ran the tests with `npm run test`. Some tests failed initially due to:

- Differences in expected error messages.
- Minor errors in files like `world.ts` and `world-generator.ts`.
- One of the files was missing.

After correcting them, I focused on getting the endpoints to work. I had to modify the `main.ts`, in particular the global prefix configuration order and the validation pipes, to make the routes respond correctly.

## Code structure

- TspSolver**: Class that receives an array of cities and calculates all possible distances between them.
  - `getAllDistances`: Returns a `TspSolveRequestDto` type object with all the cities and their distances.
  - `sortCities`: It was an initial attempt to solve the TSP directly with routes and costs, without calculating all possible combinations.

- TspSolverWithDistances**: Class that receives the array of cities with all their distances previously calculated.
  - `solve`: Implements the nearest neighbor algorithm to find a complete route and its total distance.

- Calculator**: Class in charge of calculating distances between cities.
  - getDistances`: Applies the Euclidean formula:  
    \\[
    d = √((x₂ - x₁)² + (y₂ - y₁)²)
    \\]
  - `getDistanceWithRoute`: Searches an array of distances for the distance connecting two specific cities.
  - `oldGetDistances`: Function used mainly in the `sortCities` method to test routes and record their costs.

## Final part

It took me a while to implement the code because I like to visualize what happens during execution, check for errors, and confirm that the data is flowing correctly.

I feel that the solution meets the test requirements and passes the tests correctly. In the future, with more practice, I would like to implement more efficient solutions such as genetic algorithms or more complex search algorithms that can give better results for a larger number of cities.

## Note: this text was Translated with DeepL.com (free version)