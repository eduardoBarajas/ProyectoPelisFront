import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IMovieLinks } from 'src/app/entities/IMovieLinks';
import { IResponse } from 'src/app/entities/IResponse';
import { MovieLinks } from 'src/app/entities/MovieLinks';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) { }

  saveAll(links: MovieLinks[]) {
    return this.httpClient.post(`${environment.apiUrl}admin/links/movies/`, links, this.httpOptions);
  }

  replaceAll(links: MovieLinks[]) {
    return this.httpClient.post(`${environment.apiUrl}admin/links/movies/replaceAll`, links, this.httpOptions);
  }

  getAllLinksFromMovieServer(name: string, year: number) {
    // return this.httpClient.get<IServerMovieList>(`${environment.serverUrl}movies/${year}`);
    return this.httpClient.get(`https://movies-server.herokuapp.com/movies/links/name/${name}/year/${year}`);
  }

  getFromMovie(idMovie: number) {
    return this.httpClient.get(`${environment.apiUrl}links/movie/${idMovie}`);
  }

  update(link: MovieLinks) {
    return this.httpClient.put(`${environment.apiUrl}links/movie/${link.idLinkMovie}`, link, this.httpOptions);
  }

  updateAll(links: MovieLinks[]) {
    return this.httpClient.put(`${environment.apiUrl}admin/links/movie/updateAll`, links, this.httpOptions);
  }

  deleteAll(ids: number[]) {
    return this.httpClient.delete(`${environment.apiUrl}admin/links/movie/deleteAll/ids=${ids}`);
  }

  deleteFromMovie(idMovie: number) {
   return this.httpClient.delete(`${environment.apiUrl}admin/links/movie/${idMovie}`, this.httpOptions);
  }
}
