import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource, MatSnackBar, MatDialog, MatPaginator } from '@angular/material';
import { Movie } from 'src/app/entities/Movie';
import { IMovie } from 'src/app/entities/IMovie';
import { MoviesService } from 'src/app/services/movies/movies.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MovieDialogComponent } from 'src/app/dialogs/movie-dialog/movie-dialog.component';
import { assignIMovieToIMovie } from 'src/app/helpers/MovieMapper';
import { LinksService } from 'src/app/services/links/links.service';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EditMovieComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource: MatTableDataSource<IMovie>;
  columnsToDisplay = ['idMovie', 'name', 'year', 'grade', 'length', 'genres', 'modificationDate'];
  expandedElement: IMovie | null;
  loaded = false;

  constructor(private moviesService: MoviesService, private snackbar: MatSnackBar, private dialog: MatDialog,
    private linksService: LinksService) { }

  ngOnInit() {
    this.moviesService.getAll().subscribe( {
      next: (movies => {
        // checar esta comparacion, no sirve bien
        if (movies['_embedded'] != null) {
          this.dataSource = new MatTableDataSource(movies['_embedded']['movieDTOList']);
          this.dataSource.paginator = this.paginator;
          this.loaded = true;
        } else {
          this.snackbar.open(`No hay peliculas almacenadas en el sistema.`, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        }
      }),
      error: ((error: HttpErrorResponse) => {
        this.snackbar.open(`${error.message}`, '', {
          duration: 3500, panelClass: ['error-snackbar']});
      })
    });
  }

  deleteMovie(mov: IMovie) {
    const movieDialog = this.dialog.open(MovieDialogComponent, {
      width: '500px', data: { movie: mov, operation: 'DELETE' }
    });
    movieDialog.afterClosed().subscribe( (movie: Movie) => {
      if (movie != null) {
        /*
          CREO QUE ESTO DE BORRAR CON DOBLE LLAMADA A LA API ESTA DE MAS, 
          DEBERIA INVESTIGAR SI ES VIABLE UTILIZANDO UN TRIGGER O CON LA ELIMINACION CON CASCADA
        */
        this.moviesService.deleteById(movie.idMovie).subscribe( responseDelete => {
          this.snackbar.open(`${responseDelete.message}`);
          this.dataSource.data.splice(this.dataSource.data.indexOf(mov), 1);
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.dataSource.paginator = this.paginator;
        }, (error: HttpErrorResponse) => {
          this.snackbar.open(`${error.message}`, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        });
      }
    });
  }

  editMovie(mov: IMovie) {
    const movieDialog = this.dialog.open(MovieDialogComponent, {
      width: '500px',
      data: {movie: mov, operation: 'EDIT'}
    });
    movieDialog.afterClosed().subscribe( movie => {
      if (movie != null) {
        this.moviesService.update(movie).subscribe({
          next: (response => {
            if (response.status === 'Success') {
              assignIMovieToIMovie(response, mov);
              this.snackbar.open(`${response.message}`);
            } else {
              this.snackbar.open(`${response.message}`, '', {
                duration: 3500, panelClass: ['error-snackbar']});
            }
          }), error: ((err: HttpErrorResponse) => {
            this.snackbar.open(`${err.message}`, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          })
        });
      }
    });
  }

}
