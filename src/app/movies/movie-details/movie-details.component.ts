import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Movie } from 'src/app/entities/Movie';
import { MoviesService } from 'src/app/services/movies/movies.service';
import { Route, RouterState, ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { LinksService } from 'src/app/services/links/links.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { Review } from '../../entities/Review';
import { Comment } from '../../entities/Comment';
import { CommentsService } from 'src/app/services/comments/comments.service';
import { ReviewsService } from 'src/app/services/reviews/reviews.service';
import { FavoritesService } from 'src/app/services/favorites/favorites.service';
import { WatchLaterService } from 'src/app/services/watch_later/watch-later.service';
import { WatchLater } from 'src/app/entities/WatchLater';
import { Favorite } from 'src/app/entities/Favorite';
import { MovieLinks } from 'src/app/entities/MovieLinks';
import { Observable, Subscription } from 'rxjs';
import { isUndefined } from 'util';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('InteractionDivider', null) divider: ElementRef;

  sessionMovies: Movie[] = [];
  movie: Movie;
  loadedContent = {movieLoaded: false, movieLinksLoaded: false, commentsLoaded: false, reviewsLoaded: false, similarMoviesLoaded: false,
    movieNotationsLoaded: false};
  movieLinks = new Map<string, SafeResourceUrl>();
  movieLinksMap = new Map<string, MovieLinks>();
  movieLinksKeys = [];
  movieOptionSelected = '';
  similarMovies: Movie[] = [];
  review = new Review();
  comment = new Comment();
  commentSelected = new Comment();
  commentAdded = false;
  reviewSelected = new Review();
  reviewAdded = false;
  comments: Comment[] = [];
  reviews: Review[] = [];
  addedToWatchLaterList = false;
  addedToFavoritesList = false;
  favoritesLabel = '';
  watchLaterLabel = '';
  movieSubscription = new Subscription();
  movieNotationSubscription = new Subscription();
  routeSubscription = new Subscription();
  pendientRequest = false;

  // recordatorio hacer una tabla en la base de datos para que esto no sea estatico.
  blockedSites = ['divload', 'mangoplay', 'stream78'];

  constructor(private movieService: MoviesService, private snackbar: MatSnackBar,
              private linkService: LinksService, private sanitazer: DomSanitizer, private commentSevice: CommentsService,
              private reviewService: ReviewsService, private watchLaterService: WatchLaterService,
              private favoriteService: FavoritesService, private router: Router) {
              }

  ngOnInit() {
    this.initializeComponent();
    this.routeSubscription = this.router.events.pipe(filter( e => e instanceof NavigationEnd)).subscribe( (event: NavigationEnd) => {
      // si la direccion despues del redireccionamiento es la raiz entonces no se ejecuta el componente de nuevo.
      if (event.urlAfterRedirects !== '/') {
        this.loadedContent = {movieLoaded: false, movieLinksLoaded: false, commentsLoaded: false, reviewsLoaded: false,
          similarMoviesLoaded: false, movieNotationsLoaded: false};
        this.initializeComponent();
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  initializeComponent() {
    this.movieLinksKeys = [];
    this.movieOptionSelected = '';
    this.movieLinks = new Map<string, SafeResourceUrl>();
    this.movie = null;
    this.similarMovies = [];
    this.comments = [];
    this.reviews = [];
    /*
        Si es la primera vez que se entra aqui, entonces se usara la pelicula que se almaceno en la sesion
        para evitar una llamada inecesaria, si es entra en una pelicula en la seccion de similares se hara la llamada a la api normalmente,
        al momento en que se lee una vez la pelicula de la sesion se debe limpiar para evitar que se lea mas de una vez.
    */
    if (sessionStorage.getItem('currentMovieSelected') !== 'undefined' && sessionStorage.getItem('currentMovieSelected') !== null) {
      this.movie = JSON.parse(sessionStorage.getItem('currentMovieSelected'));
      sessionStorage.removeItem('currentMovieSelected');
      this.sessionMovies.push(this.movie);
      console.log('Metodo 1');
      setTimeout( () => { this.initMovieNotations(); }, 100);
    } else {
      if (this.sessionMovies.length > 0) {
        const index = this.isInSessionMovies(+location.href.split('/')[4]);
        if (index === -1) {
          this.initMovieById(+location.href.split('/')[4]);
          console.log('estaba undefined');
        } else {
          this.movie = this.sessionMovies[index];
          setTimeout( () => { this.initMovieNotations(); }, 100);
        }
        console.log('Metodo 2');
      } else {
        this.initMovieById(+location.href.split('/')[4]);
      }
    }
  }

  initMovieById(id: number) {
    this.movieSubscription = this.movieService.getById(id).subscribe( movie => {
      if (movie['status'].includes('Success')) {
        this.movie = movie;
        if (!this.sessionMovies.includes(this.movie)) {
          this.sessionMovies.push(this.movie);
        }
        console.log('Metodo 3');
        this.initMovieNotations();
      } else {
        this.snackbar.open(movie['message'], '', {
          duration: 3500, panelClass: ['error-snackbar']});
      }
      this.movieSubscription.unsubscribe();
    }, (error: HttpErrorResponse) => {
        this.snackbar.open(error.message, '', {
          duration: 3500, panelClass: ['error-snackbar']});
        this.movieSubscription.unsubscribe();
    });
  }

  initMovieNotations() {
    // cuando entra aqui la pelicula ya esta cargada
    this.loadedContent.movieLoaded = true;
    // Si se tiene el id del usuario es que si tiene la sesion iniciada
    if (localStorage.getItem('id_user') !== 'undefined') {
      this.movieNotationSubscription = this.movieService.getMovieNotations(this.movie.idMovie, +localStorage.getItem('id_user'))
      .subscribe( response => {
        console.log(response);
        response.responses.forEach( res => {
          if (res.includes('Favorites')) {
            if (res === 'NotInFavorites') {
              this.addedToFavoritesList = false;
              this.favoritesLabel = 'Agregar A Favoritos';
            } else {
              this.addedToFavoritesList = true;
              this.favoritesLabel = 'Quitar De Favoritos';
            }
          } else {
            if (res === 'NotInWatchLater') {
              this.addedToWatchLaterList = false;
              this.watchLaterLabel = 'Ver Mas Tarde';
            } else {
              this.addedToWatchLaterList = true;
              this.watchLaterLabel = 'Quitar De Lista';
            }
          }
        });
        this.movieNotationSubscription.unsubscribe();
        // inicializar las peliculas similares
        this.initMovieLinks();
      });
    } else {
      // si llega aqui entonces no tiene la sesion iniciada
      this.favoritesLabel = 'Agregar A Favoritos';
      this.watchLaterLabel = 'Ver Mas Tarde';
      this.initMovieLinks();
    }
  }

  initMovieLinks() {
    // cuando entre aqui las notaciones de la pelicula estaran terminadas
    this.loadedContent.movieNotationsLoaded = true;
    this.linkService.getFromMovie(this.movie.idMovie).subscribe( responseLinks => {
      console.log(responseLinks);
      if (responseLinks['_embedded'] != null) {
        responseLinks['_embedded']['movieLinksDTOList'].forEach( movieLink => {
          let block = false;
          this.blockedSites.forEach( blocked => {
            if (movieLink.link.includes(blocked)) {
              block = true;
            }
          });
          if (!block) {
            this.movieLinks.set(movieLink.link, this.sanitazer.bypassSecurityTrustResourceUrl(movieLink.link));
            this.movieLinksMap.set(movieLink.link, movieLink);
            this.movieLinksKeys.push(movieLink.link);
          }
        });
        if (this.movieLinks.size > 0) {
          this.movieOptionSelected = this.movieLinksKeys[0];
        }
      }
      this.initInteractions();
    }, (err: HttpErrorResponse) => {
      this.snackbar.open(err.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
      this.initInteractions();
    });
  }

  initInteractions() {
    // cuando entra los links ya deben estar cargados
    this.loadedContent.movieLinksLoaded = true;
    this.movieService.getMovieInteractions(this.movie.idMovie).subscribe( interactions => {
      this.comments = interactions['comments'];
      this.reviews = interactions['reviews'];
      console.log(interactions);
      this.initSimiliarMovies();
    }, (err: HttpErrorResponse) => {
      this.snackbar.open(err.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
      this.initSimiliarMovies();
    });
    /*this.commentSevice.getAllByIdMovie(this.movie.idMovie).subscribe( comments => {
      if (comments['_embedded'] != null) {
        this.comments = comments['_embedded']['movieCommentDTOList'];
      }
      this.initReviews();
    }, (failed: HttpErrorResponse) => {
      this.snackbar.open(failed.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
      this.initReviews();
    });*/
  }

  /*initReviews() {
    // cuando entre los comentarios deben estar cargados
    this.loadedContent.commentsLoaded = true;
    this.reviewService.getAllByIdMovie(this.movie.idMovie).subscribe( reviews => {
      if (reviews['_embedded']) {
        this.reviews = reviews['_embedded']['movieReviewDTOList'];
      }
      this.initSimiliarMovies();
    }, (failed: HttpErrorResponse) => {
      this.snackbar.open(failed.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
      this.initSimiliarMovies();
    });
  }*/

  initSimiliarMovies() {
    // cuando entre los reviews deben estar cargados
    this.loadedContent.commentsLoaded = true;
    this.loadedContent.reviewsLoaded = true;
    const genresSize = this.movie.genres.split(',').length - 1;
    let genre = this.movie.genres.split(',').slice(0, genresSize)[Math.floor(Math.random() * genresSize)];
    console.log('GENEROOOO');
    console.log(genre);
    if (genre === 'undefined') {
      genre = this.movie.genres;
    }
    this.movieService.getMoviesFromGenreWithLimit(genre, 10).subscribe( movies => {
      console.log('SIMILARES');
      console.log(movies);
      if (movies['_embedded'] != null) {
        movies['_embedded']['movieDTOList'].forEach( m => {
          if (this.similarMovies.length < 6) {
            if (m.idMovie !== this.movie.idMovie) {
              if (this.isInSessionMovies(m.idMovie) === -1) {
                this.sessionMovies.push(m);
              }
              this.similarMovies.push(m);
            }
          }
        });
      }
      this.loadedContent.similarMoviesLoaded = true;
      console.log(this.reviews);
    }, (failed: HttpErrorResponse) => {
      this.snackbar.open(failed.message, '', {
        duration: 3500, panelClass: ['error-snackbar']
      });
      this.loadedContent.similarMoviesLoaded = true;
    });
  }

  reportLinkDown() {
    if (!this.pendientRequest) {
      this.pendientRequest = true;
      if (this.movieOptionSelected) {
        this.movieLinksMap.get(this.movieOptionSelected).active = 0;
        this.linkService.update(this.movieLinksMap.get(this.movieOptionSelected)).subscribe( result => {
          if (result['status'].includes('Success')) {
            this.snackbar.open('Se notifico al sistema');
          }
          console.log(result);
        }, (error: HttpErrorResponse) => {
          this.pendientRequest = false;
          this.snackbar.open(error.message, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        });
      } else {
        this.snackbar.open('No se ha seleccionado niguna opcion.', '', {
          duration: 3500, panelClass: ['error-snackbar']});
      }
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  publishReview() {
    if (!this.pendientRequest) {
      if (localStorage.getItem('id_user') != null) {
        if (this.review.reviewTitle.length > 1 && this.review.review.length > 1) {
          this.pendientRequest = true;
          const date = new Date();
          this.review.idMovie = this.movie.idMovie;
          this.review.publishedDate = date.toLocaleDateString();
          this.review.publishedTime = date.toTimeString().split(' ')[0].substring(0, 5);
          this.review.idReview = 0;
          this.review.idUser = +localStorage.getItem('id_user');
          this.review.username = localStorage.getItem('nombre');
          this.reviewService.save(this.review).subscribe( response => {
            this.snackbar.open('Review Agregada.');
            const newReview = new Review();
            newReview.setReview(this.review);
            newReview.idReview = response['idReview'];
            this.reviews.splice(0, 0, newReview);
            this.reviews = this.reviews.splice(0, this.reviews.length);
            console.log(response);
            console.log(this.reviews);
            this.review = new Review();
            this.reviewAdded = true;
            this.pendientRequest = false;
            setTimeout( () => { this.reviewAdded = false; }, 1000);
          }, (error: HttpErrorResponse) => {
            this.pendientRequest = false;
            this.snackbar.open(error.message, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          });
        } else {
          this.snackbar.open('Asegurate de llenar los campos.', '', {
            duration: 3500, panelClass: ['error-snackbar']});
        }
      } else {
        this.snackbar.open('Inicia sesion para poder publicar una review.', '', {
          duration: 3500, panelClass: ['error-snackbar']});
      }
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  publishComment() {
    if (!this.pendientRequest) {
      if (localStorage.getItem('id_user') != null) {
        if (this.comment.comment.length > 1) {
          this.pendientRequest = true;
          const date = new Date();
          this.comment.publishedTime = date.toTimeString().split(' ')[0].substring(0, 5);
          this.comment.publishedDate = date.toLocaleDateString();
          this.comment.idMovie = this.movie.idMovie;
          this.comment.idUser = +localStorage.getItem('id_user');
          this.comment.username = localStorage.getItem('nombre');
          console.log(this.comment);
          this.commentSevice.save(this.comment).subscribe( response => {
            this.snackbar.open('Comentario Agregado.');
            const newComment = new Comment();
            newComment.setComment(this.comment);
            newComment.idComment = response['idComment'];
            this.comments.splice(0, 0, newComment);
            // se tiene que recrear la lista de comentarios para que el virtual list lo detecte y acutalice
            this.comments = this.comments.splice(0, this.comments.length);
            this.comment = new Comment();
            this.commentAdded = true;
            this.pendientRequest = false;
            setTimeout( () => { this.commentAdded = false; }, 1000);
          }, (error: HttpErrorResponse) => {
            this.pendientRequest = false;
            this.snackbar.open(error.message, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          });
        } else {
          this.snackbar.open('Asegurate de llenar el campo.', '', {
            duration: 3500, panelClass: ['error-snackbar']});
        }
      } else {
        this.snackbar.open('Inicia sesion para poder dejar un comentario.', '', {
          duration: 3500, panelClass: ['error-snackbar']});
      }
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  deleteComment(comment: Comment) {
    if (!this.pendientRequest) {
      this.pendientRequest = true;
      this.commentSevice.deleteById(comment.idComment).subscribe( response => {
        this.snackbar.open('Se elimino el comentario.');
        this.comments.splice(this.comments.indexOf(comment), 1);
        this.comments = this.comments.splice(0, this.comments.length);
        this.pendientRequest = false;
      }, (error: HttpErrorResponse) => {
        this.pendientRequest = false;
        this.snackbar.open(error.message, '', {
          duration: 3500, panelClass: ['error-snackbar']});
      });
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  editComment(comment: Comment) {
    if (!this.pendientRequest) {
      this.pendientRequest = true;
      this.commentSevice.update(comment).subscribe( response => {
        this.snackbar.open(response.message);
        this.pendientRequest = false;
        this.commentSelected = new Comment();
      }, (error: HttpErrorResponse) => {
        this.pendientRequest = false;
        this.snackbar.open(error.message, '', {
          duration: 3500, panelClass: ['error-snackbar']});
      });
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  checkCommentAuth(comment: Comment) {
    if (localStorage.length > 0) {
      if (localStorage.getItem('authority').includes('1')) {
        return true;
      }
      if (+localStorage.getItem('id_user') === comment.idUser) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  deleteReview(review: Review) {
    if (!this.pendientRequest) {
      this.pendientRequest = true;
      this.reviewService.deleteById(review.idReview).subscribe( response => {
        this.snackbar.open('Se elimino el review.');
        this.reviews.splice(this.reviews.indexOf(review), 1);
        this.pendientRequest = false;
      }, (error: HttpErrorResponse) => {
        this.pendientRequest = false;
        this.snackbar.open(error.message, '', {
          duration: 3500, panelClass: ['error-snackbar']});
      });
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  editReview(review: Review) {
    if (!this.pendientRequest) {
      this.pendientRequest = true;
      console.log(review);
      this.reviewService.update(review).subscribe( response => {
        this.snackbar.open(response.message);
        this.pendientRequest = false;
        this.reviewSelected = new Review();
      }, (error: HttpErrorResponse) => {
        this.pendientRequest = false;
        this.snackbar.open(error.message, '', {
          duration: 3500, panelClass: ['error-snackbar']});
      });
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  checkReviewAuth(review: Review) {
    if (localStorage.length > 0) {
      if (localStorage.getItem('authority').includes('1')) {
        return true;
      }
      if (+localStorage.getItem('id_user') === review.idUser) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  modifyFavorites(movie: Movie) {
    if (localStorage.getItem('id_user') != null) {
      if (this.addedToFavoritesList) {
        // eliminar
        this.favoriteService.deleteByIdMovie(movie.idMovie).subscribe(response => {
          if (response.status.includes('Success')) {
            this.favoritesLabel = 'Agregar A Favoritos';
            this.addedToFavoritesList = false;
            this.snackbar.open('Se elimino de la lista de favoritos.');
          }
        });
      } else {
        const fav = new Favorite();
        fav.idFavorites = 0;
        fav.idMovie = movie.idMovie;
        fav.idUser = +localStorage.getItem('id_user');
        this.favoriteService.save(fav).subscribe(response => {
          this.favoritesLabel = 'Quitar De Favoritos';
          this.addedToFavoritesList = true;
          this.snackbar.open('Se agrego a la lista de favoritos.');
        });
      }
    } else {
      this.snackbar.open('Inicia sesion para guardar en tu lista de favoritos.', '', {
        duration: 3500, panelClass: ['error-snackbar']});
    }
  }

  modifyWatchLater(movie: Movie) {
    if (localStorage.getItem('id_user') != null) {
      if (this.addedToWatchLaterList) {
        // eliminar
        this.watchLaterService.deleteByIdMovie(movie.idMovie).subscribe(response => {
          if (response.status.includes('Success')) {
            this.watchLaterLabel = 'Ver Mas Tarde';
            this.addedToWatchLaterList = false;
            this.snackbar.open('Se elimino de la lista de para ver mas tarde.');
          }
        });
      } else {
        const later = new WatchLater();
        later.idWatchLater = 0;
        later.idMovie = movie.idMovie;
        later.idUser = +localStorage.getItem('id_user');
        this.watchLaterService.save(later).subscribe( response => {
          this.addedToWatchLaterList = true;
          this.watchLaterLabel = 'Quitar De Lista';
          this.snackbar.open('Se agrego a la lista para ver mas tarde.');
        });
      }
    } else {
    this.snackbar.open('Inicia sesion para guardar en tu lista para ver despues.', '', {
      duration: 3500, panelClass: ['error-snackbar']});
    }
  }

  isInSessionMovies(idMovie: number) {
    let index = -1;
    this.sessionMovies.forEach( m => {
      if (m.idMovie === idMovie) {
        index = this.sessionMovies.indexOf(m);
      }
    });
    return index;
  }

  similarMovieSelected(similar: Movie) {
    scrollTo(0, 0);
    sessionStorage.setItem('movieReload', 'true');
    this.router.navigate([`/movie/${similar.idMovie}`]);
  }

}
