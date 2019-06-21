import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Movie } from '../entities/Movie';
import { IMovieList } from '../entities/IMovieList';
import { IMovie } from '../entities/IMovie';
import { IResponse } from '../entities/IResponse';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  /*httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };
  */
  serverApiUrl = 'http://movies-server-movies-server.1d35.starter-us-east-1.openshiftapps.com/movies/';

  // serverApiUrl = 'http://localhost:8080/movies/';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) { }

  saveMovie(movie: Movie) {
    return this.httpClient.post('http://localhost:8080/movies/', movie, this.httpOptions);
  }

  saveMovies(movies: Movie[]) {
    return this.httpClient.post<IResponse>('http://localhost:8080/movies/saveAll', movies, this.httpOptions);
  }

  getMoviesFromMovieServer(year: number) {
    return this.httpClient.get<IMovieList>(`${this.serverApiUrl}${year}`);
  }
}
