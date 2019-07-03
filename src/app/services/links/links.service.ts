import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IMovieLinks } from 'src/app/entities/IMovieLinks';
import { IResponse } from 'src/app/entities/IResponse';
import { MovieLinks } from 'src/app/entities/MovieLinks';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  apiUrl = 'http://localhost:8080/';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) { }

  saveMovieLinks(links: MovieLinks[]) {
    return this.httpClient.post(`${this.apiUrl}admin/links/movies/`, links, this.httpOptions);
  }

  getMovieLinksFromMovie(idMovie: number) {
    return this.httpClient.get(`${this.apiUrl}links/movie/${idMovie}`);
  }

  deleteLinksFromMovie(idMovie: number) {
   return this.httpClient.delete(`${this.apiUrl}admin/links/movie/${idMovie}`, this.httpOptions);
  }
}
