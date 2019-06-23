import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Movie } from 'src/app/entities/Movie';
import { assignIMovieToMovie } from 'src/app/helpers/MovieMapper';

@Component({
  selector: 'app-movie-dialog',
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.css']
})
export class MovieDialogComponent implements OnInit {
  movie: Movie;
  checked = false;
  operation = '';

  constructor(private dialogRef: MatDialogRef<MovieDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.operation = this.data.operation;
    this.movie = new Movie();
    assignIMovieToMovie(this.data.movie, this.movie);
  }

  clickAceptar() {
    if (this.operation === 'EDIT' || this.operation === 'DELETE') {
      if (!this.checked) {
        this.snackbar.open('Primero confirma los cambios antes de continuar.', '', {
          duration: 1250, panelClass: ['error-snackbar']});
      } else {
        this.dialogRef.close(this.movie);
      }
    } else {
      this.dialogRef.close(this.movie);
    }
  }

  clickCancelar() {
    this.dialogRef.close(null);
  }
}
