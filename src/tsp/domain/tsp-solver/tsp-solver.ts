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
    //calcula la distancia junto de que ciudad a que ciudad
    getDistances(cityA: City, cityB: City) {
        const x = cityB.coordinates.x - cityA.coordinates.x;
        const y = cityB.coordinates.y - cityA.coordinates.y;
        return Math.round(Math.sqrt(x * x + y * y))
    }
    
    getDistanceWithRoutes(
        distances: TspDistanceRequestDto[],
        from: string,
        to: string,
    ): number {
        //decimos que nos devuelva el elemento que tenga coincida con "ciudad a" a "ciudad b"
        const entry = distances.find((d) => d.from === from && d.to === to);
        if (!entry) throw new Error(`No distance from ${from} to ${to}`);
        return entry.distance;
    }

    //version anterior de getDistances que complementa sortCities
    oldGetDistances(cityA: City, cityB: City): TspSolveResponseDto {
        const x = cityB.coordinates.x - cityA.coordinates.x;
        const y = cityB.coordinates.y - cityA.coordinates.y;
        return {
            route: [cityB.name, cityA.name],
            //redondea
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
        //ciudad de origen
        let currentCity = this.cities[0];
        //ciudades por visitar
        const citiesToVisit = this.cities.slice(1);
        //insertamos la ciudad de origen
        this.route.push(currentCity);

        while (citiesToVisit.length > 0) {
            //para guardar la ciudad con distancia minima
            let nextCitie: string | null = null;
            //para encontrar la minima distancia
            let minDistance = Infinity;

            for (const city of citiesToVisit) {
                const currentDistance = this.calculator.getDistanceWithRoutes(
                    this.distances,
                    currentCity,
                    city,
                );
                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    nextCitie = city;
                }
            }
            // guardamos la ciudad con la distancia minima
            if (nextCitie) {
                this.route.push(nextCitie);
                this.totalDistance += minDistance;
                currentCity = nextCitie;
                //eliminamos la ciudad actual de las ciudades por visitar
                citiesToVisit.splice(citiesToVisit.indexOf(nextCitie), 1);
            }
        }

        // una vez se cumple el while decimos que la "ciudad actual" sera el punto para regresar a la primera ciudad
        this.totalDistance += this.calculator.getDistanceWithRoutes(
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
    //esta funcion se encarga de generar las distancias de todos los nodos
    getAllDistances(): TspSolveRequestDto {
        //traemos todos los nombres de las ciudades
        const cities = this.cities.map((i) => i.name);
        for (let i in this.cities) {
            for (let j in this.cities) {
                //evitamos que calcule la ruta del punto de partida al punto de partida
                if (i == j) continue;
                const distance = this.calculator.getDistances(
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

    //esta era una funcion en la que tabaje originalmente
    //pero debido a que no cumplia con los test la deje de un lado
    //objetivo original: en cuanto generara las ciudades aleatorias buscar la ruta mas optima y retornarla
    sortCities(): TspSolveRequestDto {
        let currentCity: City = this.cities[0];
        const route: TspSolveResponseDto[] = [];
        //para mostrar solamente
        const rutas = [];

        while (this.citiesToVisit.length > 0) {
            //lista para guardar todas las rutas posibles del elemento actual con el resto de ciudades no visitadas
            let candidates = [];
            //se encarga de llenar todas las distancias entre la ciudad actual y sus posibilidades
            for (let i = 0; i < this.citiesToVisit.length; i++) {
                const distance = this.calculator.oldGetDistances(
                    this.citiesToVisit[i],
                    currentCity,
                );
                candidates.push(distance);
            }
            //ordenamos la lista de menor a mayor
            candidates.sort((a, b) => a.totalDistance - b.totalDistance);
            //decimos que esta es la ciudad mas cercana
            const nextCityName = candidates[0].route[1];
            const index = this.citiesToVisit.findIndex(
                (item) => item.name === nextCityName,
            );
            //esto es en caso de error por el tipo de dato
            if (index === -1) throw new Error('City not Found');

            const foundCity = this.citiesToVisit[index];
            currentCity = foundCity;
            //guardamos la mejor ruta
            route.push(candidates[0]);

            this.distances.push({
                from: candidates[0].route[0],
                to: candidates[0].route[1],
                distance: candidates[0].totalDistance,
            });
            //eliminamos la ciudad que estamos por visitar
            this.citiesToVisit.splice(index, 1);
        }
        //agregamos el regreso a la ciudad de origen
        const lastStop = this.calculator.oldGetDistances(
            this.cities[0],
            currentCity,
        );

        this.distances.push({
            from: lastStop.route[0],
            to: lastStop.route[1],
            distance: lastStop.totalDistance,
        });
        //hacemos una lista con todas las ciudades
        const cities = this.cities.map((i) => i.name);
        let totalDistance: number = 0;
        for (const r of route) {
            rutas.push(r.route);
            totalDistance += r.totalDistance;
        }

        console.log('Resultado Desglozado:  ', route);
        console.log('Ruta final:', rutas.map((r) => r.join(' → ')).join(' | '), "Distancia total:", totalDistance);
        return { cities, distances: this.distances };
    }

}
