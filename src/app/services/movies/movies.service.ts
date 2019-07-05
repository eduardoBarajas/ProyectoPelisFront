import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Movie } from 'src/app/entities/Movie';
import { IMovie } from 'src/app/entities/IMovie';
import { IResponse } from 'src/app/entities/IResponse';
import { IServerMovieList } from 'src/app/entities/IServerMovieList';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  /*httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };
  */
 
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', Accept: 'application/json'})
  };

  constructor(private httpClient: HttpClient) { }

  save(movie: Movie) {
    return this.httpClient.post<IMovie>(`${environment.apiUrl}admin/movies`, movie, this.httpOptions);
  }

  saveAll(movies: Movie[]) {
    return this.httpClient.post<IResponse<IMovie>>(`${environment.apiUrl}admin/movies/saveAll`, movies, this.httpOptions);
  }

  getAllFromMovieServer(year: number) {
    return this.httpClient.get<IServerMovieList>(`${environment.serverUrl}movies/${year}`);
  }

  getAll() {
    return this.httpClient.get(`${environment.apiUrl}admin/movies/`, this.httpOptions);
  }

  getById(idMovie: number) {
    return this.httpClient.get<IMovie>(`${environment.apiUrl}movies/${idMovie}`);
  }

  getAllByIds(ids: number[]) {
    return this.httpClient.get<IResponse<IMovie>>(`${environment.apiUrl}movies/ids=${ids}`);
  }

  getGenresList() {
    return this.httpClient.get<IResponse<string>>(`${environment.apiUrl}movies/getAllGenres`);
  }

  getAllByFilter(genre: string, startYear: number, endYear: number, startRating: number, endRating: number) {
    return this.httpClient.get(`${environment.apiUrl}movies/genre=${genre}/yearStart=${startYear}/yearEnd=${endYear}/` +
      `ratingStart=${startRating}/ratingEnd=${endRating}`);
  }

  getAllByGenre(genre: string) {
    console.log(genre);
    return this.httpClient.get(`${environment.apiUrl}movies/genre=${encodeURIComponent(genre)}`);
  }

  getAllByYear(year: number) {
    return this.httpClient.get(`${environment.apiUrl}movies/year=${year}`);
  }

  getAllRecents() {
    return this.httpClient.get(`${environment.apiUrl}movies/recents`);
  }

  getAllTrending() {
    return this.httpClient.get(`${environment.apiUrl}movies/trending`);
  }

  findIfAlreadyInDBWithNameAndYear(name: string, year: number) {
    if (name.includes('/')) {
      name = name.replace('/', '-slash-');
    }
    return this.httpClient.get<IResponse<IMovie>>(`${environment.apiUrl}movies/name=${encodeURIComponent(name)}/year=${year}`);
  }

  update(movie: Movie) {
    return this.httpClient.put<IMovie>(`${environment.apiUrl}admin/movies/`, movie, this.httpOptions);
  }

  deleteById(idMovie: number) {
    return this.httpClient.delete<IMovie>(`${environment.apiUrl}admin/movies/${idMovie}`);
  }
}
