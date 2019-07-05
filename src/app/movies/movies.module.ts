import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { HomeMoviesComponent } from './home-movies/home-movies.component';
import { SearchMoviesComponent } from './search-movies/search-movies.component';
import { MoviesRoutingModule } from './movies-routing.module';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { MovieDialogComponent } from '../dialogs/movie-dialog/movie-dialog.component';
import { FormsModule } from '@angular/forms';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CatalogComponent } from './catalog/catalog.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import { MyMoviesComponent } from './my-movies/my-movies.component';

@NgModule({
  declarations: [MovieDetailsComponent, AddMovieComponent, EditMovieComponent, HomeMoviesComponent,
    SearchMoviesComponent, CatalogComponent, MyMoviesComponent],
  imports: [
    CommonModule,
    MatTreeModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatDividerModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    ScrollingModule,
    MatSliderModule,
    MatButtonModule,
    MoviesRoutingModule
  ],
  entryComponents: [
    MovieDialogComponent
  ],
  exports: [
    HomeMoviesComponent
  ]
})
export class MoviesModule { }
