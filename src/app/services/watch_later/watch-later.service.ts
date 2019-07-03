import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { WatchLater } from 'src/app/entities/WatchLater';
import { IWatchLater } from 'src/app/entities/IWatchLater';

@Injectable({
  providedIn: 'root'
})
export class WatchLaterService {

  apiUrl = 'http://localhost:8080/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  save(watchLater: WatchLater) {
    return this.httpClient.post('http://localhost:8080/WatchLater/', watchLater, this.httpOptions);
  }
  getAllByIdUser(idUser: number) {
    return this.httpClient.get(`${this.apiUrl}WatchLater/User/${idUser}/`);
  }
  update(watchLater: WatchLater) {
    return this.httpClient.put<IWatchLater>(`${this.apiUrl}WatchLater/${watchLater.idWatchLater}/`, watchLater, this.httpOptions);
  }
  deleteById(idWatchLater: number) {
    return this.httpClient.delete<IWatchLater>(`${this.apiUrl}WatchLater/${idWatchLater}/`);
  }
  deleteByIdMovie(idMovie: number) {
    return this.httpClient.delete<IWatchLater>(`${this.apiUrl}WatchLater/Movie/${idMovie}/`);
  }
  getByIdMovie(idMovie: number) {
    return this.httpClient.get(`${this.apiUrl}WatchLater/Movie/${idMovie}/`);
  }
}
