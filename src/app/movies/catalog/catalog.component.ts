import { Component, OnInit, ViewChild } from '@angular/core';
import { Movie } from 'src/app/entities/Movie';
import { MoviesService } from 'src/app/services/movies/movies.service';
import { MatSnackBar, PageEvent, MatPaginator } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  movieList: Movie[] = [];
  genresList = [];
  indexes = [];
  pageEvent: PageEvent;
  nextAnimation = false;
  backAnimation = false;
  fadeInAnimation = false;
  fadeInUpAnimation = false;
  inFilterSearch = false;
  filterData = {genre: '', startYear: 0, endYear: 2019, startRating: 0, endRating: 5};

  constructor(public movieService: MoviesService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.movieService.getGenresList().subscribe( response => {
      if (response.status.includes('Success')) {
        this.genresList = response.responses;
      } else {
        this.snackbar.open(`${response.message}`, '', {
          duration: 3500, panelClass: ['error-snackbar']});
      }
    }, (error: HttpErrorResponse) => {
      this.snackbar.open(`${error.message}`, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
    this.movieService.getAllByYear(2019).subscribe( newMovies => {
      if (newMovies['_embedded'] != null) {
        this.movieList = newMovies['_embedded']['movieDTOList'];
        this.setPageEvent(this.movieList);
        this.pageChange(this.pageEvent);
      } else {
        this.snackbar.open(`No se obtuvieron las peliculas`, '', {
          duration: 3500, panelClass: ['error-snackbar']});
      }
    }, (err: HttpErrorResponse) => {
      this.snackbar.open(`${err.message}`, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
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

  getMoviesByFilter() {
    if (this.validateFilter()) {
      this.movieService.getAllByFilter(this.filterData.genre, this.filterData.startYear, this.filterData.endYear,
        this.filterData.startRating, this.filterData.endRating).subscribe( response => {
          if (response['_embedded'] != null) {
            this.movieList = response['_embedded']['movieDTOList'];
            this.inFilterSearch = !this.inFilterSearch;
            this.setPageEvent(this.movieList);
            this.paginator.firstPage();
            this.pageChange(this.pageEvent);
          } else {
            this.snackbar.open(`No se encontraron peliculas con esas especificaciones`, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          }
        }, (error: HttpErrorResponse) => {
          this.snackbar.open(error.message, '', {
            duration: 3500, panelClass: ['error-snackbar']});
      });
    }
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

  validateFilter() {
    let validFilter = false;
    let message = '';
    if (this.filterData.genre.length > 0) {
      if (this.filterData.endRating >= this.filterData.startRating) {
        if (this.filterData.endYear >= this.filterData.startYear) {
          // no puede ser menor
          validFilter = true;
        } else {
          message = 'El final de la busqueda debe ser mayor o igual al del principio.';
        }
      } else {
        // no puede ser menor el segundo parametro
        message = 'El final del rating debe ser mayor o igual al del principio.';
      }
    } else {
      // seleccionar una categoria
      message = 'Debes seleccionar una categoria primero';
    }
    if (!validFilter) {
      this.snackbar.open(message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    }
    return validFilter;
  }
}
