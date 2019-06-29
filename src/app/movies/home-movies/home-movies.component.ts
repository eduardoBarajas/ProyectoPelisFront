import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { MoviesService } from 'src/app/services/movies/movies.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { IMovie } from 'src/app/entities/IMovie';
import { ChangeDetectionStrategy } from '@angular/core';
import { Movie } from 'src/app/entities/Movie';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-home-movies',
  templateUrl: './home-movies.component.html',
  styleUrls: ['./home-movies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMoviesComponent implements OnInit  {

  premierMovies: Movie[] = [];
  actionMovies: Movie[] = [];
  horrorMovies: Movie[] = [];
  comedyMovies: Movie[] = [];
  loadedcomplete = false;
  loaded = {terror: false, accion: false, comedia: false, premier: false, all: false};
  images = ['https://images.sex.com/images/pinporn/2019/05/03/300/21088302.gif', 'https://images.sex.com/images/pinporn/2019/02/03/300/20635872.gif', 'https://images.sex.com/images/pinporn/2018/04/11/300/19356107.gif',
    'https://images.sex.com/images/pinporn/2018/07/25/300/19762833.gif', 'https://images.sex.com/images/pinporn/2017/11/20/300/18681745.gif', 'https://images.sex.com/images/pinporn/2018/01/14/300/18946562.gif',
    'https://images.sex.com/images/pinporn/2019/04/20/300/21015233.gif', 'https://images.sex.com/images/pinporn/2019/03/03/300/20769374.gif', 'https://images.sex.com/images/pinporn/2018/06/10/300/19586422.gif',
    'https://images.sex.com/images/pinporn/2019/02/17/300/20706146.gif', 'https://images.sex.com/images/pinporn/2018/12/17/300/20372862.gif', 'https://images.sex.com/images/pinporn/2018/10/11/300/20074640.gif',
    'https://images.sex.com/images/pinporn/2019/01/16/300/20539865.gif', 'https://images.sex.com/images/pinporn/2017/01/21/300/17253575.gif', 'https://images.sex.com/images/pinporn/2019/04/19/300/21013166.gif'];

  constructor(private moviesService: MoviesService, private snackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.moviesService.getAllByYear(2019).subscribe( newMovies => {
      if (newMovies['_embedded'] != null) {
        this.initializeCarousel('premier', newMovies['_embedded']['movieDTOList']);
      } else {
        this.snackbar.open(`No se obtuvieron los estrenos`, '', {
          duration: 3500, panelClass: ['error-snackbar']});
      }
    }, (err: HttpErrorResponse) => {
      this.snackbar.open(`${err.message}`, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
    this.setMovies('Recientes');
  }

  initializeCarousel(className: string, movies: Movie[]) {
    movies.forEach( movie => {
      $(`.${className}__carousel`).append(`<div class="item ${className}"><div class="card"><div class="card__cover">` +
        `<img src="${movie.poster}" alt=""><a href="#" class="card__play"><i class="icon ion-ios-play"></i></a></div>` + 
        `<div class="card__content"><h3 class="card__title"><a href="#">${movie.name}</a></h3><span class="card__category">` +
        `<a href="#">genre</a></span><span class="card__rate"><i class="icon ion-ios-star"></i>${movie.grade}</span></div></div></div>`);
    });
    $(`.${className}__carousel`).owlCarousel({
      mouseDrag: true,
      touchDrag: true,
      dots: false,
      loop: false,
      autoplay: false,
      smartSpeed: 600,
      margin: 30,
      responsive : {
        0 : {
          items: 2,
        },
        576 : {
          items: 2,
        },
        768 : {
          items: 3,
        },
        992 : {
          items: 4,
        },
        1200 : {
          items: 4,
        },
      }
    });
    $('.premier__nav--next').on('click', e => {
      $('.premier__carousel, .home__bg').trigger('next.owl.carousel');
    });
    $('.premier__nav--prev').on('click', e => {
      $('.premier__carousel, .home__bg').trigger('prev.owl.carousel');
    });
    $('.spinner').fadeOut('slow');
    $('#layout').removeClass('invisible');
    $('#layout').addClass('fadeInLeft');
  }

  setMovies(action: string) {
    $('#movie-content').removeClass('bounceInUp');
    switch (action) {
      case 'Recientes': {
        this.moviesService.getAllByGenre('terror').subscribe( movies => {
          if (movies['_embedded'] != null) {
            this.addMoviesToDOM(movies['_embedded']['movieDTOList'].slice(0, 10));
          } else {
            this.snackbar.open(`No se obtuvieron los estrenos`, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          }
        });
        break;
      }
      case 'Populares': {
        this.moviesService.getAllByGenre('comedia').subscribe( movies => {
          if (movies['_embedded'] != null) {
            this.addMoviesToDOM(movies['_embedded']['movieDTOList'].slice(0, 10));
          } else {
            this.snackbar.open(`No se obtuvieron los estrenos`, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          }
        });
        break;
      }
      case 'Proximamente': {
        this.moviesService.getAllByGenre('drama').subscribe( movies => {
          if (movies['_embedded'] != null) {
            this.addMoviesToDOM(movies['_embedded']['movieDTOList'].slice(0, 10));
          } else {
            this.snackbar.open(`No se obtuvieron los estrenos`, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          }
        });
        break;
      }
      case 'MejorCalificadas': {
        this.moviesService.getAllByGenre('romance').subscribe( movies => {
          if (movies['_embedded'] != null) {
            this.addMoviesToDOM(movies['_embedded']['movieDTOList'].slice(0, 10));
          } else {
            this.snackbar.open(`No se obtuvieron los estrenos`, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          }
        });
        break;
      }
    }
  }

  addMoviesToDOM(movies: IMovie[]) {
    $('#movie-content').empty();
    movies.forEach( movie => {
      let generos = '';
      movie.genres.split(',').forEach( genero => {
        if (genero !== '') {
          generos += '<a href="#">' + genero + '</a>';
        }
      });
      let node = `<div class="col-6 col-sm-12 col-lg-6"><div class="card card--list"><div class="row"><div class="col-12`
      + ` col-sm-4"><div class="card__cover"><img src="${movie.poster}" alt=""><a href="#" class="card__play"> <i class="icon `
      + `ion-ios-play"></i></a></div></div><div class="col-12 col-sm-8"> <div class="card__content"><h3 class="card__title">`
      + `<a href="#">${movie.name}</a></h3><span class="card__category">${generos}</span>`
      + `<div class="card__wrap"><span class="card__rate"><i class="icon ion-ios-star"></i>${movie.grade}</span><ul class="card__list">`
      + `<li>HD</li><li>16+</li></ul></div><div class="card__description"><p>${movie.synopsis}</p></div></div></div></div></div></div>`;
      if ((movies.indexOf(movie) + 1) % 2 === 0 ) {
        node += '<mat-divider class="w-75 my-1" style="border-top-width: 3px;"></mat-divider>';
      }
      $(`#movie-content`).append(node);
    });
    $('#movie-content').addClass('bounceInUp');
  }

  removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
}
