import { Injectable, NotImplementedException } from '@nestjs/common';
import { TspSolveResponseDto } from './dtos/response/solve.response.dto';
import { TspSolveRequestDto } from './dtos/request/solve.request.dto';
import { TspGenerateCitiesResponseDto } from './dtos/response/generate-cities.response.dto';
import { WorldGenerator } from './domain/world-generator/world-generator';
import { TspGenerateCitiesRequestDto } from './dtos/request/generate-cities.request.dto';
import { TspSolver } from './domain/tsp-solver/tsp-solver';
/**
 * The TspService class is a NestJS service responsible for implementing the
 * core logic of solving the Traveling Salesman Problem (TSP) and generating
 * random city coordinates.
 */
@Injectable()
export class TspService {
    health(){
        console.log("Se activo health");
        return "Todo okay"
    }
    //debe calcular la ruta mas corta en base a un set de ciudades
    solve(payload: TspSolveRequestDto): TspSolveResponseDto {
        void payload;
        throw new NotImplementedException(
            `${this.solve.name} method not implemented in ${TspService.name}`,
        );

        // To do
        // - Implement TSP solver
    }
    //genera las ciudades, y calcula sus distancias
    generateCities(
        payload: TspGenerateCitiesRequestDto,
    ): TspGenerateCitiesResponseDto {
        const worldGenerator = new WorldGenerator(payload.numOfCities, {
            x: payload.worldBoundX,
            y: payload.worldBoundY,
        });
        //genera las ciudades
        worldGenerator.generateCities();

        const { cities } = worldGenerator.getWorld();
        //nuestra clase para resolver
        const tspSolver = new TspSolver();

        //le enviamos las ciudades
        const response = tspSolver.sortList(cities)
        console.log(response);
        // To do
        // - Calculate distance between cities
        return {cities: ["XD"], distances: []}
        // throw new NotImplementedException(
        //     `${this.generateCities.name} method not implemented in ${TspService.name}`,
        // );
    }
}
