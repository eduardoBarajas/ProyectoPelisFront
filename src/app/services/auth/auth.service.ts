import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/entities/User';
import { IUser } from 'src/app/entities/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  isLogged = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  login(user: string, pass: string) {
    return this.http.post(`${environment.apiUrl}users/login/`, { username: user, password: pass});
  }

  createAccount(username: string, pass: string, email: string) {
    const user = new User();
    user.username = username;
    user.password = pass;
    user.email = email;
    user.creationDate = new Date().toLocaleString();
    user.name = username;
    return this.http.post<IUser>(`${environment.apiUrl}users/`, user, this.httpOptions);
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
