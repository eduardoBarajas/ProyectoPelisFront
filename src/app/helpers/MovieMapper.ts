import { IMovie } from '../entities/IMovie';
import { Movie } from '../entities/Movie';

export function assignIMovieToIMovie(movieOne: IMovie, movieTwo: IMovie) {
        movieTwo.cast = movieOne.cast;
        movieTwo.genres = movieOne.genres;
        movieTwo.grade = movieOne.grade;
        movieTwo.idMovie = movieOne.idMovie;
        movieTwo.length = movieOne.length;
        movieTwo.name = movieOne.name;
        movieTwo.originalName = movieOne.originalName;
        movieTwo.poster = movieOne.poster;
        movieTwo.synopsis = movieOne.synopsis;
        movieTwo.tags = movieOne.tags;
        movieTwo.creationDate = movieOne.creationDate;
        movieTwo.modificationDate = movieOne.modificationDate;
        movieTwo.year = movieOne.year;
    }

export function assignIMovieToMovie(movieOne: IMovie, movieTwo: Movie) {
    movieTwo.cast = movieOne.cast;
    movieTwo.genres = movieOne.genres;
    movieTwo.grade = movieOne.grade;
    movieTwo.idMovie = movieOne.idMovie;
    movieTwo.length = movieOne.length;
    movieTwo.name = movieOne.name;
    movieTwo.originalName = movieOne.originalName;
    movieTwo.poster = movieOne.poster;
    movieTwo.synopsis = movieOne.synopsis;
    movieTwo.tags = movieOne.tags;
    movieTwo.creationDate = movieOne.creationDate;
    movieTwo.modificationDate = movieOne.modificationDate;
    movieTwo.year = movieOne.year;
}