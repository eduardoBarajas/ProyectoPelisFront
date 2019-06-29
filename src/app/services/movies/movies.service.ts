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

  apiUrl = 'http://localhost:8080/movies/';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) { }

  save(movie: Movie) {
    return this.httpClient.post<IMovie>('http://localhost:8080/movies/', movie, this.httpOptions);
  }

  saveAll(movies: Movie[]) {
    return this.httpClient.post<IResponse<IMovie>>(`${this.apiUrl}saveAll`, movies, this.httpOptions);
  }

  getAllFromMovieServer(year: number) {
    return this.httpClient.get<IServerMovieList>(`${this.serverApiUrl}${year}`);
  }

  getAll() {
    return this.httpClient.get(this.apiUrl);
  }

  getById(idMovie: number) {
    return this.httpClient.get<IMovie>(`${this.apiUrl}${idMovie}`);
  }

  getGenresList() {
    return this.httpClient.get<IResponse<string>>(`${this.apiUrl}getAllGenres`);
  }

  getAllByFilter(genre: string, startYear: number, endYear: number, startRating: number, endRating: number) {
    return this.httpClient.get(`${this.apiUrl}genre=${genre}/yearStart=${startYear}/yearEnd=${endYear}/ratingStart=${startRating}` +
      `/ratingEnd=${endRating}`);
  }

  getAllByGenre(genre: string) {

    console.log(genre);
    return this.httpClient.get(`${this.apiUrl}genre=${encodeURIComponent(genre)}`);
  }

  getAllByYear(year: number) {
    return this.httpClient.get(`${this.apiUrl}year=${year}`);
  }

  findIfAlreadyInDBWithNameAndYear(name: string, year: number) {
    if (name.includes('/')) {
      name = name.replace('/', '-slash-');
    }
    return this.httpClient.get<IResponse<IMovie>>(`${this.apiUrl}name=${encodeURIComponent(name)}/year=${year}`);
  }

  update(movie: Movie) {
    return this.httpClient.put<IMovie>(`${this.apiUrl}`, movie, this.httpOptions);
  }

  deleteById(idMovie: number) {
    return this.httpClient.delete<IMovie>(`${this.apiUrl}${idMovie}`);
  }
}
