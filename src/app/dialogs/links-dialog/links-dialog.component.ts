import { Component, OnInit, Inject } from '@angular/core';
import { MovieLinks } from 'src/app/entities/MovieLinks';
import { assignMovieLinks } from 'src/app/helpers/MovieLinksMapper';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { LinksService } from 'src/app/services/links/links.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  currentMovie = {idMovie: -1, name: '', year: -1};
  operationComplete = {deleted: false, added: false, updated: false};
  pendientRequest = false;

  constructor(private dialogRef: MatDialogRef<LinksDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
              private snackbar: MatSnackBar, private linksService: LinksService) { }

    ngOnInit() {
      this.currentMovie = {idMovie: this.data.idMovie, name: this.data.name, year: this.data.year};
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
        if (!this.pendientRequest) {
          this.pendientRequest = true;
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
            }, (error: HttpErrorResponse) => {
              this.operationComplete.updated = true;
              this.snackbar.open(`${error.message}`, '', {
                duration: 3500, panelClass: ['error-snackbar']});
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
            }, (error: HttpErrorResponse) => {
              this.operationComplete.deleted = true;
              this.snackbar.open(`${error.message}`, '', {
                duration: 3500, panelClass: ['error-snackbar']});
            });
          } else {
            this.operationComplete.deleted = true;
          }
          if (this.addedMovieLinks.length > 0) {
            this.addedMovieLinks.map( link => { link.active = 1; link.idMovie = this.currentMovie.idMovie; link.idLinkMovie = 0; });
            this.linksService.saveAll(this.addedMovieLinks).subscribe( () => {
              this.operationComplete.added = true;
              this.operationFinished();
            }, (error: HttpErrorResponse) => {
              this.operationComplete.added = true;
              this.snackbar.open(`${error.message}`, '', {
                duration: 3500, panelClass: ['error-snackbar']});
            });
          } else {
            this.operationComplete.added = true;
          }
        } else {
          this.snackbar.open('Confirma los cambios antes de continuar.', '', {panelClass: ['error-snackbar']});
        }
      } else {
        this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
      }
    }

    clickCancelar() {
      if (!this.pendientRequest) {
        this.dialogRef.close(null);
      } else {
        this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
      }
    }

    clickDeleteLink(link) {
      if (!this.pendientRequest) {
        this.pendientRequest = true;
        if (this.movieLinks.includes(link)) {
          this.deletedMovieLinks.push(this.movieLinks.splice(this.movieLinks.indexOf(link), 1)[0]);
        }
        if (this.addedMovieLinks.includes(link)) {
          this.addedMovieLinks.splice(this.addedMovieLinks.indexOf(link), 1);
        }
        this.pendientRequest = false;
      } else {
        this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
      }
    }

    clickAddLink() {
      if (!this.pendientRequest) {
        this.pendientRequest = true;
        this.addedMovieLinks.push(new MovieLinks());
        this.pendientRequest = false;
      } else {
        this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
      }
    }

    operationFinished() {
      if (this.operationComplete.added && this.operationComplete.deleted && this.operationComplete.updated) {
        this.pendientRequest = true;
        this.snackbar.open('Operacion Terminada Exitosamente');
        this.dialogRef.close(null);
      }
    }

    clickAddServerLinks() {
      if (!this.pendientRequest) {
        this.pendientRequest = true;
        this.linksService.getAllLinksFromMovieServer(this.currentMovie.name, this.currentMovie.year).subscribe( response => {
          console.log(response);
          if (response['status'] === 'Success') {
            let msg = 'Se agregaron los links';
            response['links'].forEach( (link: string) => {
              const responseLink = new MovieLinks();
              if (!this.checkInLists(link)) {
                responseLink.active = 1;
                responseLink.idMovie = this.currentMovie.idMovie;
                responseLink.link = link;
                this.addedMovieLinks.push(responseLink);
              } else {
                msg = 'Se agregaron algunos links, a excepcion de los repetidos.';
              }
            });
            this.snackbar.open(msg);
            this.pendientRequest = false;
          }
        }, (error: HttpErrorResponse) => {
          this.pendientRequest = false;
          this.snackbar.open(`${error.message}`, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        });
      } else {
        this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
      }
    }

    checkInLists(link: string) {
      if (this.addedMovieLinks.filter( movLink => movLink.link === link)[0] === undefined) {
        if (this.deletedMovieLinks.filter( movLink => movLink.link === link)[0] === undefined) {
          if (this.movieLinks.filter( movLink => movLink.link === link)[0] === undefined) {
            return false;
          }
        }
      }
      return true;
    }
}
