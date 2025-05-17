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
    //recived a cities array with her distances, then return the best route
    solve(payload: TspSolveRequestDto): TspSolveResponseDto {
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
    //generate the cities with her distances
    generateCities(
        payload: TspGenerateCitiesRequestDto,
    ): TspGenerateCitiesResponseDto {
        try {
            const worldGenerator = new WorldGenerator(payload.numOfCities, {
                x: payload.worldBoundX,
                y: payload.worldBoundY,
            });
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
    //endpoint Optional to test function sort a random cities array with the best route
    optionalEnd(
        payload: TspGenerateCitiesRequestDto,
    ): TspGenerateCitiesResponseDto {
        try {
            const worldGenerator = new WorldGenerator(payload.numOfCities, {
                x: payload.worldBoundX,
                y: payload.worldBoundY,
            });
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
