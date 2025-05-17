import { Injectable, NotImplementedException } from '@nestjs/common';
import { TspSolveResponseDto } from './dtos/response/solve.response.dto';
import { TspSolveRequestDto } from './dtos/request/solve.request.dto';
import { TspGenerateCitiesResponseDto } from './dtos/response/generate-cities.response.dto';
import { WorldGenerator } from './domain/world-generator/world-generator';
import { TspGenerateCitiesRequestDto } from './dtos/request/generate-cities.request.dto';
import {
    TspSolver,
    TspSolverWithDistances,
} from './domain/tsp-solver/tsp-solver';
/**
 * The TspService class is a NestJS service responsible for implementing the
 * core logic of solving the Traveling Salesman Problem (TSP) and generating
 * random city coordinates.
 */
@Injectable()
export class TspService {
    tspSolver: TspSolver;
    TspSolverWthD: TspSolverWithDistances;
    health() {
        return 'Backend working!';
    }
    //debe calcular la ruta mas corta en base a un set de ciudades
    solve(payload: TspSolveRequestDto): TspSolveResponseDto {
        // void payload;
        // To do
        // - Implement TSP solver
        try {
            const { cities, distances } = payload;
            this.TspSolverWthD = new TspSolverWithDistances(cities, distances);
            const response = this.TspSolverWthD.solve();
            return response;
        } catch (error: any) {
            throw new NotImplementedException(
                `Error Ocurred [TspService/Solve]: ${error}`,
            );
        }
    }
    //genera las ciudades, y calcula sus distancias
    generateCities(
        payload: TspGenerateCitiesRequestDto,
    ): TspGenerateCitiesResponseDto {
        try {
            // To do
            // - Calculate distance between cities
            const worldGenerator = new WorldGenerator(payload.numOfCities, {
                x: payload.worldBoundX,
                y: payload.worldBoundY,
            });
            //genera las ciudades
            worldGenerator.generateCities();
            const { cities } = worldGenerator.getWorld();
            this.tspSolver = new TspSolver(cities);
            const response = this.tspSolver.getAllDistances();
            return response;
        } catch (error: any) {
            throw new NotImplementedException(
                `Error Ocurred [TspService/generateCities]: ${error}`,
            );
        }
    }

    optionalEnd(
        payload: TspGenerateCitiesRequestDto,
    ): TspGenerateCitiesResponseDto {
        try {
            const worldGenerator = new WorldGenerator(payload.numOfCities, {
                x: payload.worldBoundX,
                y: payload.worldBoundY,
            });
            //genera las ciudades
            worldGenerator.generateCities();
            const { cities } = worldGenerator.getWorld();
            this.tspSolver = new TspSolver(cities);
            const response = this.tspSolver.sortCities();
            return response;
        } catch (error: any) {
            throw new NotImplementedException(
                `Error Ocurred [TspService/generateCities]: ${error}`,
            );
        }
    }
}
