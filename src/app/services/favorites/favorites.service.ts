import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Favorite } from 'src/app/entities/Favorite';
import { IFavorite } from 'src/app/entities/IFavorite';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  save(favorite: Favorite) {
    return this.httpClient.post(`${environment.apiUrl}Favorites/`, favorite, this.httpOptions);
  }
  getAllByIdUser(idUser: number) {
    return this.httpClient.get(`${environment.apiUrl}Favorites/User/${idUser}/`);
  }
  update(favorite: Favorite) {
    return this.httpClient.put<IFavorite>(`${environment.apiUrl}Favorites/${favorite.idFavorites}/`, favorite, this.httpOptions);
  }
  deleteById(idFavorite: number) {
    return this.httpClient.delete<IFavorite>(`${environment.apiUrl}Favorites/${idFavorite}/`);
  }
  deleteByIdMovie(idMovie: number) {
    return this.httpClient.delete<IFavorite>(`${environment.apiUrl}Favorites/Movie/${idMovie}/`);
  }
  getByIdMovie(idMovie: number) {
    return this.httpClient.get(`${environment.apiUrl}Favorites/Movie/${idMovie}/`);
  }
  getByIdMovieAndIdUser(idMovie: number, idUser: number) {
    return this.httpClient.get(`${environment.apiUrl}Favorites/Movie/${idMovie}/User/${idUser}/`);
  }
}
