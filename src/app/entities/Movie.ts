import { IMovie } from './IMovie';

export class Movie implements IMovie {
    movieLinks: string[];
    status: string;
    message: string;
    idMovie: number;
    name: string;
    originalName: string;
    synopsis: string;
    length: number;
    poster: string;
    tags: string;
    genres: string;
    cast: string;
    grade: number;
    year: number;
    modificationDate: string;
    creationDate: string;
}
