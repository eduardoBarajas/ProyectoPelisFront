import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/entities/Movie';
import { MoviesService } from 'src/app/services/movies/movies.service';
import { Route, RouterState, ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { LinksService } from 'src/app/services/links/links.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

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

  constructor(private movieService: MoviesService, private activatedRoute: ActivatedRoute, private snackbar: MatSnackBar,
    private linkService: LinksService, private sanitazer: DomSanitizer, private router: Router) { }

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
            this.movieLinks.set(movieLink.link, this.sanitazer.bypassSecurityTrustResourceUrl(movieLink.link));
            this.movieLinksKeys.push(movieLink.link);
          });
          if (this.movieLinks.size > 0) {
            this.movieOptionSelected = this.movieLinksKeys[0];
          }
        }
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

}
