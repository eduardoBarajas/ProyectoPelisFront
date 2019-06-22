import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Movie } from 'src/app/entities/Movie';
import { IMovie } from 'src/app/entities/IMovie';
import { IResponse } from 'src/app/entities/IResponse';
import { IMovieList } from 'src/app/entities/IMovieList';


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

  apiUrl = 'http://localhost:8080/movies/';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) { }

  saveMovie(movie: Movie) {
    return this.httpClient.post<IMovie>('http://localhost:8080/movies/', movie, this.httpOptions);
  }

  saveMovies(movies: Movie[]) {
    return this.httpClient.post<IResponse<IMovie>>(`${this.apiUrl}saveAll`, movies, this.httpOptions);
  }

  getMoviesFromMovieServer(year: number) {
    return this.httpClient.get<IMovieList>(`${this.serverApiUrl}${year}`);
  }
}
