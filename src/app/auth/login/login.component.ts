import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  pass: string;


  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.username, this.pass).subscribe( response => {
      console.log(response);
      localStorage.setItem('id_user', response['user']['id'].toString());
      localStorage.setItem('token', response['token']);
      localStorage.setItem('nombre', response['user']['name']);
      localStorage.setItem('expiration', response['expiration']);
      localStorage.setItem('authority', response['user']['authority']);
      this.router.navigate(['/']).then( e => {
        this.snackbar.open('Bienvenido ' + localStorage.getItem('nombre'));
      });
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.snackbar.open(`${error.message}`, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
  }

}
