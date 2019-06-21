import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { ListMoviesComponent } from './list-movies/list-movies.component';
import { HomeMoviesComponent } from './home-movies/home-movies.component';
import { SearchMoviesComponent } from './search-movies/search-movies.component';
import { MoviesRoutingModule } from './movies-routing.module';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [MovieDetailsComponent, AddMovieComponent, EditMovieComponent, ListMoviesComponent, HomeMoviesComponent,
    SearchMoviesComponent],
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MoviesRoutingModule
  ],
  exports: [
    HomeMoviesComponent
  ]
})
export class MoviesModule { }
