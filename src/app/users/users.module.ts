import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users/list-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  declarations: [ListUsersComponent, EditUserComponent, AddUserComponent],
  imports: [
    CommonModule
  ]
})
export class UsersModule { }
