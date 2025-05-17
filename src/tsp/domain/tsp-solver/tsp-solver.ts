import { City } from '../world-generator/city';
import { TspSolveResponseDto } from 'src/tsp/dtos/response/solve.response.dto';
import {
    TspSolveRequestDto,
    TspDistanceRequestDto,
} from 'src/tsp/dtos/request/solve.request.dto';
import { TspDistanceResponseDto } from 'src/tsp/dtos/response/generate-cities.response.dto';
//calcularDistancias
class Calculator {
    constructor() {}
    //formula
    //d = √((x₂ - x₁)² + (y₂ - y₁)²)
    //calculate the distance from which city to which city
    getDistance(cityA: City, cityB: City):number {
        const x = cityB.coordinates.x - cityA.coordinates.x;
        const y = cityB.coordinates.y - cityA.coordinates.y;
        return Math.round(Math.sqrt(x * x + y * y))
    }

    //find the previously calculated distance between two cities
    getDistanceWithRoute(
        distances: TspDistanceRequestDto[],
        from: string,
        to: string,
    ): number {
        const entry = distances.find((d) => d.from === from && d.to === to);
        if (!entry) throw new Error(`No distance from ${from} to ${to}`);
        return entry.distance;
    }

    //older version of getDistances that complements sortCities
    oldGetDistances(cityA: City, cityB: City): TspSolveResponseDto {
        const x = cityB.coordinates.x - cityA.coordinates.x;
        const y = cityB.coordinates.y - cityA.coordinates.y;
        return {
            route: [cityB.name, cityA.name],
            totalDistance: Math.round(Math.sqrt(x * x + y * y)),
        };
    }
}
//Resuelve con distancias ya dadas
export class TspSolverWithDistances {
    route: string[] = [];
    totalDistance = 0;
    calculator: Calculator;
    constructor(
        private cities: string[],
        private distances: TspDistanceRequestDto[],
    ) {
        this.calculator = new Calculator();
    }

    solve(): TspSolveResponseDto {
        //initial value first city
        let currentCity = this.cities[0];
        //create a array without the first city
        const citiesToVisit = this.cities.slice(1);
        //save the first city
        this.route.push(currentCity);

        while (citiesToVisit.length > 0) {
            //to keep the city safe with minimum distance
            let nextCitie: string | null = null;
            let minDistance = Infinity;

            for (const city of citiesToVisit) {
                const currentDistance = this.calculator.getDistanceWithRoute(
                    this.distances,
                    currentCity,
                    city,
                );
                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    nextCitie = city;
                }
            }
            // saved the city with the minimum distance
            if (nextCitie) {
                this.route.push(nextCitie);
                this.totalDistance += minDistance;
                currentCity = nextCitie;
                //delete the current city from the cities to visit
                citiesToVisit.splice(citiesToVisit.indexOf(nextCitie), 1);
            }
        }

        //once the while finish, we say that the current city will be the point to return the first city
        this.totalDistance += this.calculator.getDistanceWithRoute(
            this.distances,
            currentCity,
            this.cities[0],
        );
        this.route.push(this.cities[0]);

        return {
            route: this.route,
            totalDistance: this.totalDistance,
        };
    }
}

export class TspSolver {
    citiesToVisit: City[];
    calculator: Calculator;
    distances: TspDistanceResponseDto[] = [];

    constructor(private cities: City[]) {
        this.citiesToVisit = cities.slice(1);
        this.calculator = new Calculator();
    }
    //This function is responsible for generating the distances of all the nodes
    getAllDistances(): TspSolveRequestDto {
        //traemos todos los nombres de las ciudades
        const cities = this.cities.map((i) => i.name);
        for (let i in this.cities) {
            for (let j in this.cities) {
                //prevent it from calculating the route from the starting point to the starting point
                if (i == j) continue;
                const distance = this.calculator.getDistance(
                    this.cities[i],
                    this.cities[j],
                );
                this.distances.push({
                    from: this.cities[i].name,
                    to: this.cities[j].name,
                    distance,
                });
            }
        }
        return { cities, distances: this.distances };
    }

    //This was a feature I was originally working on
    //But because it didn't pass the tests, I set it aside
    //Original goal: Once the random cities are generated, find the most optimal route and return it
    sortCities(): TspSolveRequestDto {
        let currentCity: City = this.cities[0];
        const route: TspSolveResponseDto[] = [];
        //the funtion is show the result
        const rutas = [];

        while (this.citiesToVisit.length > 0) {
            //list to save all possible routes of the current element with the rest of the unvisited cities
            let candidates = [];
            //it's responsible for filling all the gaps between the current city and its possibilities
            for (let i = 0; i < this.citiesToVisit.length; i++) {
                const distance = this.calculator.oldGetDistances(
                    this.citiesToVisit[i],
                    currentCity,
                );
                candidates.push(distance);
            }
            //sort from smaller to taller
            candidates.sort((a, b) => a.totalDistance - b.totalDistance);
            //this is the nextCity
            const nextCityName = candidates[0].route[1];
            const index = this.citiesToVisit.findIndex(
                (item) => item.name === nextCityName,
            );
            //if ocurred an error for the type the data, we avoid thah the nextCity will be null
            if (index === -1) throw new Error('City not Found');

            const foundCity = this.citiesToVisit[index];
            currentCity = foundCity;
            //save the best route
            route.push(candidates[0]);

            this.distances.push({
                from: candidates[0].route[0],
                to: candidates[0].route[1],
                distance: candidates[0].totalDistance,
            });
            // delete the currentCity thah we're visiting right now
            this.citiesToVisit.splice(index, 1);
        }
        // add the current citie to the first city
        const lastStop = this.calculator.oldGetDistances(
            this.cities[0],
            currentCity,
        );

        this.distances.push({
            from: lastStop.route[0],
            to: lastStop.route[1],
            distance: lastStop.totalDistance,
        });
        //create a list with all citys
        const cities = this.cities.map((i) => i.name);
        let totalDistance: number = 0;
        for (const r of route) {
            rutas.push(r.route);
            totalDistance += r.totalDistance;
        }

        // console.log('Result:  ', route);
        // console.log('Final Route:', rutas.map((r) => r.join(' → ')).join(' | '), "Total distance:", totalDistance);
        return { cities, distances: this.distances };
    }

}
