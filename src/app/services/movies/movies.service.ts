import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Movie } from 'src/app/entities/Movie';
import { IMovie } from 'src/app/entities/IMovie';
import { IResponse } from 'src/app/entities/IResponse';
import { IServerMovieList } from 'src/app/entities/IServerMovieList';


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

  apiUrl = 'http://localhost:8080/';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', Accept: 'application/json'})
  };

  constructor(private httpClient: HttpClient) { }

  save(movie: Movie) {
    return this.httpClient.post<IMovie>('http://localhost:8080/admin/movies/', movie, this.httpOptions);
  }

  saveAll(movies: Movie[]) {
    return this.httpClient.post<IResponse<IMovie>>(`${this.apiUrl}admin/movies/saveAll`, movies, this.httpOptions);
  }

  getAllFromMovieServer(year: number) {
    return this.httpClient.get<IServerMovieList>(`${this.serverApiUrl}movies/${year}`);
  }

  getAll() {
    return this.httpClient.get(`${this.apiUrl}admin/movies/`, this.httpOptions);
  }

  getById(idMovie: number) {
    return this.httpClient.get<IMovie>(`${this.apiUrl}movies/${idMovie}`);
  }

  getGenresList() {
    return this.httpClient.get<IResponse<string>>(`${this.apiUrl}movies/getAllGenres`);
  }

  getAllByFilter(genre: string, startYear: number, endYear: number, startRating: number, endRating: number) {
    return this.httpClient.get(`${this.apiUrl}movies/genre=${genre}/yearStart=${startYear}/yearEnd=${endYear}/ratingStart=${startRating}` +
      `/ratingEnd=${endRating}`);
  }

  getAllByGenre(genre: string) {
    console.log(genre);
    return this.httpClient.get(`${this.apiUrl}movies/genre=${encodeURIComponent(genre)}`);
  }

  getAllByYear(year: number) {
    return this.httpClient.get(`${this.apiUrl}movies/year=${year}`);
  }

  findIfAlreadyInDBWithNameAndYear(name: string, year: number) {
    if (name.includes('/')) {
      name = name.replace('/', '-slash-');
    }
    return this.httpClient.get<IResponse<IMovie>>(`${this.apiUrl}movies/name=${encodeURIComponent(name)}/year=${year}`);
  }

  update(movie: Movie) {
    return this.httpClient.put<IMovie>(`${this.apiUrl}admin/movies/`, movie, this.httpOptions);
  }

  deleteById(idMovie: number) {
    return this.httpClient.delete<IMovie>(`${this.apiUrl}admin/movies/${idMovie}`);
  }
}
