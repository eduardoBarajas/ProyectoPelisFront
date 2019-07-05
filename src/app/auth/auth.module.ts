import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatFormFieldModule, MatToolbarModule, MatDividerModule, MatCheckboxModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [
    LoginComponent, RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatDividerModule,
    MatCheckboxModule,
    MatInputModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
