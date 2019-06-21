import { IMovie } from './IMovie';

export interface IMovieList {
    status: string;
    message: string;
    year: string;
    movieCount: number;
    movies: IMovie[];
}