import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:8080/users/login/';
  constructor(private http: HttpClient) { }

  login(user: string, pass: string) {
    return this.http.post(`${this.apiUrl}`, { username: user, password: pass});
  }

  checkIfTokenIsValid(): boolean {
    if (localStorage.getItem('token')) {
      const date1 = new Date();
      const date2 = new Date(localStorage.getItem('expiration'));
      if (date1 > date2) {
        localStorage.clear();
        return false;
      }
      return true;
    } else {
      console.log('no existe la sesion');
      return false;
    }
  }
}
