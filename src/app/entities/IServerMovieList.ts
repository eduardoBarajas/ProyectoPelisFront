import { IMovie } from './IMovie';

export interface IServerMovieList {
    status: string;
    message: string;
    year: string;
    movieCount: number;
    movies: IMovie[];
}
