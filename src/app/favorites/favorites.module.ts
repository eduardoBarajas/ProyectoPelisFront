import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditFavoriteComponent } from './edit-favorite/edit-favorite.component';
import { ListFavoritesComponent } from './list-favorites/list-favorites.component';

@NgModule({
  declarations: [EditFavoriteComponent, ListFavoritesComponent],
  imports: [
    CommonModule
  ]
})
export class FavoritesModule { }
