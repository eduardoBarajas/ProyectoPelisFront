import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { CatalogComponent } from './catalog/catalog.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MyMoviesComponent } from './my-movies/my-movies.component';

const routes: Routes = [
  { path: 'add', component: AddMovieComponent },
  { path: 'edit', component: EditMovieComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'movie/:idMovie', component: MovieDetailsComponent },
  { path: 'my-movies', component: MyMoviesComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MoviesRoutingModule { }
