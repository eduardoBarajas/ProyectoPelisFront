import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Input } from '@angular/compiler/src/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  // @ViewChild('usernameInput', null) usernameInput: ElementRef;

  username: FormControl = new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(25)]);
  pass: FormControl = new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(25)]);
  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) {
   }

  ngOnInit() {
    this.username.setValue('Ingresa Tu Usuario');
    this.pass.setValue('.');
  }

  ngAfterViewInit(): void {
  }

  login() {
    if (this.isDataValid()) {
      this.authService.login(this.username.value, this.pass.value).subscribe( response => {
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
        if (error.status === 401) {
          this.snackbar.open(`Login Incorrecto`, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        } else {
          this.snackbar.open(`${error.message}`, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        }
      });
    } else {
      this.snackbar.open(`Hubo un problema con los datos ingresados.`, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    }
  }
  isDataValid() {
    if (this.pass.valid && this.username.valid) {
      return true;
    } else {
      return false;
    }
  }

  recoverPassword() {
    console.log('xd');
  }

  cleanUsernameControl() {
    if (this.username.value === 'Ingresa Tu Usuario') {
      this.username.setValue('');
      this.pass.setValue(' ');
    }
  }

}
