import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {

  contentLoaded = false;
  movie: Movie;
  movieLinks = new Map<string, SafeResourceUrl>();
  movieLinksKeys = [];
  movieOptionSelected = '';
  similarMovies: Movie[] = [];
  review = new Review();
  comment = new Comment();
  commentSelected = new Comment();
  reviewSelected = new Review();
  comments: Comment[] = [];
  reviews: Review[] = [];
  addedToWatchLaterList = false;
  addedToFavoritesList = false;
  favoritesLabel = '';
  watchLaterLabel = '';


  // recordatorio hacer una tabla en la base de datos para que esto no sea estatico.
  blockedSites = ['divload', 'mangoplay', 'stream78'];

  constructor(private movieService: MoviesService, private activatedRoute: ActivatedRoute, private snackbar: MatSnackBar,
    private linkService: LinksService, private sanitazer: DomSanitizer, private router: Router, private commentSevice: CommentsService,
    private reviewService: ReviewsService, private watchLaterService: WatchLaterService, private favoriteService: FavoritesService) { }

  ngOnInit() {
    this.initializeComponent();
    this.router.events.pipe(
      filter( e => e instanceof NavigationEnd || e instanceof NavigationStart)
    ).subscribe( event => {
      if (event instanceof NavigationEnd) {
        this.initializeComponent();
      } else {
        this.contentLoaded = false;
      }
    });
  }

  initializeComponent() {
    this.movieLinksKeys = [];
    this.movieOptionSelected = '';
    this.movieLinks = new Map<string, SafeResourceUrl>();
    this.movie = null;
    this.similarMovies = [];
    this.activatedRoute.url.subscribe( url => {
      this.linkService.getMovieLinksFromMovie(+url[1].path).subscribe( responseLinks => {
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
              this.movieLinksKeys.push(movieLink.link);
            }
          });
          if (this.movieLinks.size > 0) {
            this.movieOptionSelected = this.movieLinksKeys[0];
          }
          this.watchLaterService.getByIdMovie(+url[1].path).subscribe( response => {
            if (response['status'].includes('Success')) {
              this.addedToWatchLaterList = true;
              this.watchLaterLabel = 'Quitar De Lista';
            } else {
              this.addedToWatchLaterList = false;
              this.watchLaterLabel = 'Ver Mas Tarde';
            }
          });
          this.favoriteService.getByIdMovie(+url[1].path).subscribe( response => {
            if (response['status'].includes('Success')) {
              this.addedToFavoritesList = true;
              this.favoritesLabel = 'Quitar De Favoritos';
            } else {
              this.addedToFavoritesList = false;
              this.favoritesLabel = 'Agregar A Favoritos';
            }
          });
        }
        this.commentSevice.getAllByIdMovie(+url[1].path).subscribe( comments => {
          if (comments['_embedded'] != null) {
            this.comments = comments['_embedded']['movieCommentDTOList'];
          }
        }, (failed: HttpErrorResponse) => {
          this.snackbar.open(failed.message, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        });
        this.reviewService.getAllByIdMovie(+url[1].path).subscribe( reviews => {
          if (reviews['_embedded']) {
            this.reviews = reviews['_embedded']['movieReviewDTOList'];
          }
          console.log(reviews);
        }, (failed: HttpErrorResponse) => {
          this.snackbar.open(failed.message, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        });
        this.movieService.getById(+url[1].path).subscribe( movie => {
          if (movie['status'].includes('Success')) {
            this.movie = movie;
            let genresSize = this.movie.genres.split(',').length - 1;
            this.movieService.getAllByGenre(this.movie.genres.split(',').slice(0, genresSize)
              [Math.floor(Math.random() * genresSize)]).subscribe( movies => {
                if (movies['_embedded'] != null) {
                  movies['_embedded']['movieDTOList'].forEach( m => {
                    if (this.similarMovies.length < 6) {
                      if (m.idMovie !== this.movie.idMovie) {
                        this.similarMovies.push(m);
                      }
                    }
                  });
                }
              }, (failed: HttpErrorResponse) => {
                this.snackbar.open(failed.message, '', {
                  duration: 3500, panelClass: ['error-snackbar']});
                });
          } else {
            this.snackbar.open(movie['message'], '', {
              duration: 3500, panelClass: ['error-snackbar']});
          }
          this.contentLoaded = true;
        }, (error: HttpErrorResponse) => {
          this.snackbar.open(error.message, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        });
      }, (err: HttpErrorResponse) => {
        this.snackbar.open(err.message, '', {
          duration: 3500, panelClass: ['error-snackbar']});
      });
    });
  }

  publishReview() {
    const date = new Date();
    this.review.idMovie = this.movie.idMovie;
    this.review.publishedDate = date.toLocaleDateString();
    this.review.publishedTime = date.toTimeString().split(' ')[0].substring(0, 5);
    this.review.idReview = 0;
    this.review.idUser = +localStorage.getItem('id_user');
    this.review.username = localStorage.getItem('nombre');
    this.reviewService.save(this.review).subscribe( response => {
      this.snackbar.open(response['message']);
      const newReview = new Review();
      newReview.setReview(this.review);
      newReview.idReview = response['idReview'];
      this.reviews.push(newReview);
      console.log(response);
    }, (error: HttpErrorResponse) => {
      this.snackbar.open(error.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
  }

  publishComment() {
    const date = new Date();
    this.comment.publishedTime = date.toTimeString().split(' ')[0].substring(0, 5);
    this.comment.publishedDate = date.toLocaleDateString();
    this.comment.idMovie = this.movie.idMovie;
    this.comment.idUser = +localStorage.getItem('id_user');
    this.comment.username = localStorage.getItem('nombre');
    console.log(this.comment);
    this.commentSevice.save(this.comment).subscribe( response => {
      this.snackbar.open(response['message']);
      const newComment = new Comment();
      newComment.setComment(this.comment);
      newComment.idComment = response['idComment'];
      this.comments.push(newComment);
    }, (error: HttpErrorResponse) => {
      this.snackbar.open(error.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
  }

  deleteComment(comment: Comment) {
    this.commentSevice.deleteById(comment.idComment).subscribe( response => {
      this.snackbar.open('Se elimino el comentario.');
      this.comments.splice(this.comments.indexOf(comment), 1);
    }, (error: HttpErrorResponse) => {
      this.snackbar.open(error.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
  }

  editComment(comment: Comment) {
    this.commentSevice.update(comment).subscribe( response => {
      this.snackbar.open(response.message);
      this.commentSelected = new Comment();
    }, (error: HttpErrorResponse) => {
      this.snackbar.open(error.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
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
    this.reviewService.deleteById(review.idReview).subscribe( response => {
      this.snackbar.open('Se elimino el review.');
      this.reviews.splice(this.reviews.indexOf(review), 1);
    }, (error: HttpErrorResponse) => {
      this.snackbar.open(error.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
  }

  editReview(review: Review) {
    console.log(review);
    this.reviewService.update(review).subscribe( response => {
      this.snackbar.open(response.message);
      this.reviewSelected = new Review();
    }, (error: HttpErrorResponse) => {
      this.snackbar.open(error.message, '', {
        duration: 3500, panelClass: ['error-snackbar']});
    });
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
    if (this.addedToFavoritesList) {
      // eliminar
      this.favoriteService.deleteByIdMovie(movie.idMovie).subscribe(response => {
        if (response.status.includes('Success')) {
          this.favoritesLabel = 'Agregar A Favoritos';
          this.addedToFavoritesList = false;
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
      });
    }
  }

  modifyWatchLater(movie: Movie) {
    if (this.addedToWatchLaterList) {
      // eliminar
      this.watchLaterService.deleteByIdMovie(movie.idMovie).subscribe(response => {
        if (response.status.includes('Success')) {
          this.watchLaterLabel = 'Ver Mas Tarde';
          this.addedToWatchLaterList = false;
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
      });
    }
  }
}
