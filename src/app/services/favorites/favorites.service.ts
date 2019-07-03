import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Favorite } from 'src/app/entities/Favorite';
import { IFavorite } from 'src/app/entities/IFavorite';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  apiUrl = 'http://localhost:8080/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  save(favorite: Favorite) {
    return this.httpClient.post('http://localhost:8080/Favorites/', favorite, this.httpOptions);
  }
  getAllByIdUser(idUser: number) {
    return this.httpClient.get(`${this.apiUrl}Favorites/User/${idUser}/`);
  }
  update(favorite: Favorite) {
    return this.httpClient.put<IFavorite>(`${this.apiUrl}Favorites/${favorite.idFavorites}/`, favorite, this.httpOptions);
  }
  deleteById(idFavorite: number) {
    return this.httpClient.delete<IFavorite>(`${this.apiUrl}Favorites/${idFavorite}/`);
  }
  deleteByIdMovie(idMovie: number) {
    return this.httpClient.delete<IFavorite>(`${this.apiUrl}Favorites/Movie/${idMovie}/`);
  }
  getByIdMovie(idMovie: number) {
    return this.httpClient.get(`${this.apiUrl}Favorites/Movie/${idMovie}/`);
  }
}
