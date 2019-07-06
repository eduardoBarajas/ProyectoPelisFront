import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]{3,15}$')]);
  pass: FormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]);
  email: FormControl = new FormControl('', [Validators.email, Validators.required, Validators.minLength(5), Validators.maxLength(30)]);

  constructor(private authService: AuthService, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {
  }

  createAccount() {
    if (this.username.valid && this.pass.valid && this.email.valid) {
      this.authService.createAccount(this.username.value, this.pass.value, this.email.value).subscribe( user => {
        if (user.status === 'Success') {
          this.router.navigate(['login']).then( e => {
            this.snackbar.open('Usuario Creado Exitosamente.');
          });
        } else {
          this.snackbar.open(user.message, '', {panelClass: ['error-snackbar']});
        }
      }, (error: HttpErrorResponse) => {
        this.snackbar.open(`Hubo un problema con el servidor ${error.status}, por favor intenta de nuevo mas tarde.`,
         '', {panelClass: ['error-snackbar']});
      });
    } else {
      this.snackbar.open('Los datos son incorrectos, por favor intenta de nuevo.', '', {panelClass: ['error-snackbar']});
    }
  }
}
