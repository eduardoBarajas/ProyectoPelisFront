import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  login(user: string, pass: string) {
    return this.http.post(`${environment.apiUrl}users/login/`, { username: user, password: pass});
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

  logOut() {
    localStorage.clear();
    this.isLogged.next(false);
  }

  checkIfLogin(): Observable<boolean> {
    return this.isLogged.asObservable();
  }
}
