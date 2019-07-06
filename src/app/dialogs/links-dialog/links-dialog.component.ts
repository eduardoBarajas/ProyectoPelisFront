import { Component, OnInit, Inject } from '@angular/core';
import { MovieLinks } from 'src/app/entities/MovieLinks';
import { assignMovieLinks } from 'src/app/helpers/MovieLinksMapper';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { LinksService } from 'src/app/services/links/links.service';

@Component({
  selector: 'app-links-dialog',
  templateUrl: './links-dialog.component.html',
  styleUrls: ['./links-dialog.component.css']
})
export class LinksDialogComponent implements OnInit {

  checked = false;
  movieLinks: MovieLinks[] = [];
  originalLinks = new Map<number, string>();
  deletedMovieLinks: MovieLinks[] = [];
  addedMovieLinks: MovieLinks[] = [];
  currentMovie = -1;
  operationComplete = {deleted: false, added: false, updated: false};

  constructor(private dialogRef: MatDialogRef<LinksDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
              private snackbar: MatSnackBar, private linksService: LinksService) { }

    ngOnInit() {
      this.currentMovie = this.data.idMovie;
      this.linksService.getFromMovie(this.data.idMovie).subscribe( result => {
        if (result['_embedded'] != null) {
          result['_embedded']['movieLinksDTOList'].forEach( links => {
            this.movieLinks.push(links);
            this.originalLinks.set(links.idLinkMovie, links.link);
          });
        } else {
          this.snackbar.open('Esta pelicula no tiene links asignados', '', {panelClass: ['error-snackbar']});
          this.addedMovieLinks.push(new MovieLinks());
        }
      });
    }

    clickAceptar() {
      if (this.checked) {
        const updatedLinks: MovieLinks[] = [];
        this.movieLinks.forEach( link => {
          if (this.originalLinks.get(link.idLinkMovie) !== link.link) {
            updatedLinks.push(link);
          }
        });
        if (updatedLinks.length > 0) {
          this.linksService.updateAll(updatedLinks).subscribe( () => {
            this.operationComplete.updated = true;
            this.operationFinished();
          });
        } else {
          this.operationComplete.updated = true;
        }
        const idsDeleted: number[] = [];
        this.deletedMovieLinks.forEach( link => {
          idsDeleted.push(link.idLinkMovie);
        });
        if (idsDeleted.length > 0) {
          this.linksService.deleteAll(idsDeleted).subscribe( () => {
            this.operationComplete.deleted = true;
            this.operationFinished();
          });
        } else {
          this.operationComplete.deleted = true;
        }
        if (this.addedMovieLinks.length > 0) {
          this.addedMovieLinks.map( link => { link.active = 1; link.idMovie = this.currentMovie; link.idLinkMovie = 0; });
          this.linksService.saveAll(this.addedMovieLinks).subscribe( () => {
            this.operationComplete.added = true;
            this.operationFinished();
          });
        } else {
          this.operationComplete.added = true;
        }
      } else {
        this.snackbar.open('Confirma los cambios antes de continuar.', '', {panelClass: ['error-snackbar']});
      }
    }

    clickCancelar() {
      this.dialogRef.close(null);
    }

    clickDeleteLink(link) {
      if (this.movieLinks.includes(link)) {
        this.deletedMovieLinks.push(this.movieLinks.splice(this.movieLinks.indexOf(link), 1)[0]);
      }
      if (this.addedMovieLinks.includes(link)) {
        this.addedMovieLinks.splice(this.addedMovieLinks.indexOf(link), 1);
      }
    }

    clickAddLink() {
      this.addedMovieLinks.push(new MovieLinks());
    }

    operationFinished() {
      if (this.operationComplete.added && this.operationComplete.deleted && this.operationComplete.updated) {
        this.snackbar.open('Operacion Terminada Exitosamente');
        this.dialogRef.close(null);
      }
    }
}
