import { IMovieLinks } from '../entities/IMovieLinks';
import { MovieLinks } from '../entities/MovieLinks';

export function assignMovieLinks(one: MovieLinks, two: MovieLinks) {
    two.active = one.active;
    two.idLinkMovie = one.idLinkMovie;
    two.idMovie = one.idMovie;
    two.link = one.link;
}