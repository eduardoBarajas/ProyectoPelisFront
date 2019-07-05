import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { WatchLater } from 'src/app/entities/WatchLater';
import { IWatchLater } from 'src/app/entities/IWatchLater';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WatchLaterService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  save(watchLater: WatchLater) {
    return this.httpClient.post(`${environment.apiUrl}WatchLater/`, watchLater, this.httpOptions);
  }
  getAllByIdUser(idUser: number) {
    return this.httpClient.get(`${environment.apiUrl}WatchLater/User/${idUser}/`);
  }
  update(watchLater: WatchLater) {
    return this.httpClient.put<IWatchLater>(`${environment.apiUrl}WatchLater/${watchLater.idWatchLater}/`, watchLater, this.httpOptions);
  }
  deleteById(idWatchLater: number) {
    return this.httpClient.delete<IWatchLater>(`${environment.apiUrl}WatchLater/${idWatchLater}/`);
  }
  deleteByIdMovie(idMovie: number) {
    return this.httpClient.delete<IWatchLater>(`${environment.apiUrl}WatchLater/Movie/${idMovie}/`);
  }
  getByIdMovie(idMovie: number) {
    return this.httpClient.get(`${environment.apiUrl}WatchLater/Movie/${idMovie}/`);
  }
  getByIdMovieAndIdUser(idMovie: number, idUser: number) {
    return this.httpClient.get(`${environment.apiUrl}WatchLater/Movie/${idMovie}/User/${idUser}/`);
  }
}
