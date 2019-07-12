import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent, MatSnackBar } from '@angular/material';
import { Movie } from 'src/app/entities/Movie';
import { MoviesService } from 'src/app/services/movies/movies.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoritesService } from 'src/app/services/favorites/favorites.service';
import { WatchLaterService } from 'src/app/services/watch_later/watch-later.service';

@Component({
  selector: 'app-my-movies',
  templateUrl: './my-movies.component.html',
  styleUrls: ['./my-movies.component.css']
})
export class MyMoviesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  movieList: Movie[] = [];
  indexes = [];
  pageEvent: PageEvent;
  nextAnimation = false;
  backAnimation = false;
  fadeInAnimation = false;
  fadeInUpAnimation = false;
  showingFavorites = true;
  contentLoaded = true;
  moviesLoaded = false;

  constructor(public movieService: MoviesService, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.getFavoriteMovies();
  }

  pageChange(page: PageEvent) {
    if (page.pageIndex === page.previousPageIndex) {
      this.fadeInUpAnimation = true;
    }
    if (page.pageIndex > page.previousPageIndex) {
      this.nextAnimation = !this.nextAnimation;
    }
    if (page.pageIndex < page.previousPageIndex) {
      this.backAnimation = !this.backAnimation;
    }
    this.fadeInAnimation = false;
    setTimeout( e => {
      this.pageEvent = page;
      if ((page.pageSize * page.pageIndex) + page.pageSize > this.movieList.length) {
        this.indexes = Array(Math.abs(((page.pageSize * page.pageIndex) - this.movieList.length))).fill(0).
          map((x, i) => (page.pageSize * page.pageIndex) + i);
      } else {
        this.indexes = Array(page.pageSize).fill(0).map((x, i) => (page.pageSize * page.pageIndex) + i);
      }
      this.backAnimation = false;
      this.nextAnimation = false;
      if (!this.fadeInUpAnimation) {
        this.fadeInAnimation = true;
      } else {
        this.fadeInUpAnimation = false;
      }
    }, 800);
  }

  getFavoriteMovies() {
    this.moviesLoaded = false;
    setTimeout(() => {
      if (!this.moviesLoaded) {
        this.contentLoaded = false;
      }
    }, 1000);
    this.movieService.getFavoriteMoviesByUserId(+localStorage.getItem('id_user')).subscribe( response => {
      if (response.responses.length > 0) {
        this.movieList = response.responses;
        this.moviesLoaded = true;
        this.setMovies(this.movieList);
      } else {
        this.snackbar.open('No tienes peliculas agregadas a tus favoritos.', '', {duration: 3500, panelClass: ['error-snackbar']});
      }
    }, (error: HttpErrorResponse) => {
      this.snackbar.open(error.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
  }

  getWatchLaterMovies() {
    this.moviesLoaded = false;
    setTimeout(() => {
      if (!this.moviesLoaded) {
        this.contentLoaded = false;
      }
    }, 1000);
    this.movieService.getWatchLaterMoviesByUserId(+localStorage.getItem('id_user')).subscribe( response => {
      if (response.responses.length > 0) {
        this.movieList = response.responses;
        this.moviesLoaded = true;
        this.setMovies(this.movieList);
      } else {
        this.snackbar.open('No tienes peliculas agregadas en tu lista para ver mas tarde.', '',
        { duration: 3500, panelClass: ['error-snackbar']});
      }
    }, (error: HttpErrorResponse) => {
      this.snackbar.open(error.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
  }

  setMovies(movies: Movie[]) {
    movies.forEach( movie => {
      console.log(movie);
      const movieGenres = movie.genres.split(',').slice(0, movie.genres.split(',').length - 1);
      let genres = `${movieGenres[Math.floor(Math.random() * movieGenres.length)]},`;
      // tslint:disable-next-line: prefer-for-of
      for (let x = 0; x < movieGenres.length; x++) {
        const index = Math.floor(Math.random() * movieGenres.length);
        if (!genres.includes(movieGenres[index]) && genres.split(',').length < 3) {
          genres += `${movieGenres[index]},`;
        }
      }
      movie.genres = genres.slice(0, genres.length - 1);
    });
    this.setPageEvent(movies);
    this.paginator.firstPage();
    this.pageChange(this.pageEvent);
    this.contentLoaded = true;
  }



  setPageEvent(movies: Movie[]) {
    this.pageEvent = new PageEvent();
    // si las peliculas son menor a diez entonces se hara la lista de indices de ese
    // tamano para que no haya problemas con la paginacion.
    if (movies.length > 10) {
      this.indexes = Array(10).fill(0).map((x, i) => i);
      this.pageEvent.pageSize = 10;
    } else {
      this.indexes = Array(movies.length).fill(0).map((x, i) => i);
      this.pageEvent.pageSize = movies.length;
    }
    this.pageEvent.length = movies.length;
    this.pageEvent.pageIndex = 0;
    this.pageEvent.previousPageIndex = 0;
  }

  movieSelected(movie: Movie) {
    sessionStorage.setItem('currentMovieSelected', JSON.stringify(movie));
    this.router.navigate([`/movie/${movie.idMovie}`]);
  }

  tabChanged() {
    if (!this.showingFavorites) {
      this.showingFavorites = !this.showingFavorites;
      this.getFavoriteMovies();
    } else {
      this.showingFavorites = !this.showingFavorites;
      this.getWatchLaterMovies();
    }
  }
}
