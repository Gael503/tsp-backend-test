import { World } from '../world-generator/world';
import { City } from '../world-generator/city';
import { TspSolveResponseDto } from 'src/tsp/dtos/response/solve.response.dto';
export class TspSolver {
    //formula
    //d = √((x₂ - x₁)² + (y₂ - y₁)²)
    //calcula la distancia junto de que ciudad a que ciudad
    calcalDistances(cityA: City, cityB: City): TspSolveResponseDto {
        const x = cityB.coordinates.x - cityA.coordinates.x;
        const y = cityB.coordinates.y - cityA.coordinates.y;
        //redondea
        return {
            route: [cityB.name, cityA.name],
            totalDistance: Math.round(Math.sqrt(x * x + y * y)),
        };
    }
    //comparar distancia actual
    //llega la lista de las ciudades
    sortList(cities: City[]) {
        const originCity = cities[0];
        const currentCities = [...cities.slice(1)]; // excluye originCity desde el inicio
        let currentElement: City = originCity;
        const route: TspSolveResponseDto[] = [];

        while (currentCities.length > 0) {
            let candidates = [];
            for (let i = 0; i < currentCities.length; i++) {
                const distance = this.calcalDistances(
                    currentCities[i],
                    currentElement,
                );
                candidates.push(distance);
            }
            candidates.sort((a, b) => a.totalDistance - b.totalDistance);
            // console.log("Rutas ordenadas: ", provicionalRoutes);
            const nextCityName = candidates[0].route[1];
            const index = currentCities.findIndex(
                (item) => item.name === nextCityName,
            );

            if (index === -1) {
                throw new Error('Ciudad no encontrada en currentCities');
            }

            const foundCity = currentCities[index];
            currentElement = foundCity;

            route.push(candidates[0]);
            // console.log("Nuevo current element:", curretElement, index);
            // console.log('Borrando: ', currentCities[0]); // si quieres ir ciudad por ciudad
            currentCities.splice(index, 1);
        }
        //agregamos el regreso a la ciudad de origen
        const lastStop = this.calcalDistances(originCity, currentElement);
        route.push(lastStop);
        //acomodamos la response para que coincida con la interfaz
        const rutas = [];
        let totalDistance: number = 0;
        for (const r of route) {
            rutas.push(r.route);
            totalDistance += r.totalDistance;
        }
        const path = rutas.map(r => r[0]);
        path.push(originCity.name); // cierra el ciclo
        // console.log('Resultado Desglozado:  ', route);
        // console.log('Ruta final:', rutas.map((r) => r.join(' → ')).join(' | '));
        return { route: path, totalDistance };
    }
}
