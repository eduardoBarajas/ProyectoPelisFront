import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IMovieLinks } from 'src/app/entities/IMovieLinks';
import { IResponse } from 'src/app/entities/IResponse';
import { MovieLinks } from 'src/app/entities/MovieLinks';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) { }

  saveMovieLinks(links: MovieLinks[]) {
    return this.httpClient.post(`${environment.apiUrl}admin/links/movies/`, links, this.httpOptions);
  }

  getMovieLinksFromMovie(idMovie: number) {
    return this.httpClient.get(`${environment.apiUrl}links/movie/${idMovie}`);
  }

  deleteLinksFromMovie(idMovie: number) {
   return this.httpClient.delete(`${environment.apiUrl}admin/links/movie/${idMovie}`, this.httpOptions);
  }
}
