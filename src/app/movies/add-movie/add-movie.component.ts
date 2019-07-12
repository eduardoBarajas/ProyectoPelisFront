import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { Movie } from 'src/app/entities/Movie';
import { IMovieLinks } from 'src/app/entities/IMovieLinks';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { MoviesService } from 'src/app/services/movies/movies.service';
import { LinksService } from 'src/app/services/links/links.service';
import { MovieLinks } from 'src/app/entities/MovieLinks';
import { MovieUniqueCheck } from 'src/app/entities/MovieUniqueCheck';

interface TreeNode {
  name: string;
  children?: IMovieNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

interface IMovieNode {
  name: string;
  originalName: string;
  movieLinks: string[];
  synopsis: string;
  length: number;
  poster: string;
  tags: string;
  genres: string;
  cast: string;
  year: number;
  modificationDate: string;
}

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  loaded = false;
// tslint:disable-next-line: variable-name
  movie_node_fields = ['name', 'originalName', 'synopsis', 'length', 'poster', 'tags', 'genres',
  'cast', 'year', 'modificationDate'];
// tslint:disable-next-line: variable-name
  movie_node_blocked_fields = ['name', 'year', 'modificationDate'];
  // esta varible es la que determina si mostrar o no el spinner cuando se cargan las peliculas.
  gettingMovies = false;
  // esta variable determina si se muestra el spinner cuando se agregan las peliculas
  uploadingMovies = false;
  pendientRequest = false;
  years = [];
// tslint:disable-next-line: variable-name
  year_selected = 2019;
  TREE_DATA: TreeNode[];

  // el siguiente map es utilizado para tener una referencia del nodo, utilizando el nodo anidado como key.
  flatNodeMap = new Map<FlatNode, TreeNode>();
  treeNodeMap = new Map<TreeNode, FlatNode>();
  // moviesSelected es un Map donde se almacenaran todas las peliculas que sean elegidas en la lista de checkbox.
  moviesSelected = new Map<FlatNode, TreeNode>();
  // Estos controles son utilizados para configurar la vista de arbol.
  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<TreeNode, FlatNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, FlatNode>;

  transformer = (node: TreeNode, nivel: number) => {
    const flatnode = {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: nivel
    }
    this.treeNodeMap.set(node, flatnode);
    this.flatNodeMap.set(flatnode, node);
    return flatnode;
  }

  constructor(private moviesService: MoviesService, private linksService: LinksService, private snackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.treeControl = new FlatTreeControl<FlatNode>(node => node.level,
      node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    // items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
    for (let i = 1925; i <= new Date().getFullYear(); i++) {
      this.years.push(i);
    }
    this.year_selected = this.years[this.years.length - 1];
    this.yearSelected();
    this.loaded = true;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  /*
    La funcion movieSelected tendra la funcion de insertar y extraer nodos de la lista de peliculas seleccionadas.
    recibe como parametro un nodo anidado(FlatNode).
  */
  movieSelected(node: FlatNode) {
    if (!this.pendientRequest) {
      this.pendientRequest = true;
      if (this.moviesSelected.has(node)) {
        this.moviesSelected.delete(node);
        this.pendientRequest = false;
      } else {
        this.moviesSelected.set(node, this.flatNodeMap.get(node));
        const movie: MovieUniqueCheck[] = [];
        movie.push(new MovieUniqueCheck(this.flatNodeMap.get(node).children[0].name,
        this.flatNodeMap.get(node).children[0].year));
        this.moviesService.findIfAlreadyInDBWithNameAndYear(movie).subscribe({
          next: (response => {
            if (response.status === 'MoviesFound') {
              this.snackbar.open(response.message);
            }
            console.log(response);
            this.pendientRequest = false;
          }),
          error: ((err: HttpErrorResponse) => {
            this.pendientRequest = false;
            this.snackbar.open(`${err.message}`, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          })
        });
      }
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  saveMovies() {
    // si no se ha seleccionado ninguna pelicula se regresa el mensaje de error y se cancela el metodo.
    if (this.moviesSelected.size < 1) {
      this.snackbar.open('No se selecciono ninguna pelicula', '', {
        duration: 3000, panelClass: ['error-snackbar']});
      return;
    }
    if (!this.pendientRequest) {
      this.pendientRequest = true;
      this.uploadingMovies = !this.uploadingMovies;
      const movies = [];
      this.moviesSelected.forEach( movieNode => {
        const movie = new Movie();
        movie.cast = movieNode.children[0].cast;
        movie.creationDate = movieNode.children[0].modificationDate;
        movie.genres = movieNode.children[0].genres;
        movie.grade = 5;
        movie.length = movieNode.children[0].length;
        movie.originalName = movieNode.children[0].originalName;
        movie.poster = movieNode.children[0].poster;
        movie.synopsis = movieNode.children[0].synopsis;
        movie.tags = movieNode.children[0].tags;
        movie.name = movieNode.children[0].name;
        movie.year = movieNode.children[0].year;
        movie.modificationDate = movieNode.children[0].modificationDate;
        movie.movieLinks = movieNode.children[0].movieLinks;
        movies.push(movie);
      });
      // con operation_finished se tendra un control de las dos operaciones que se realizan a continuacion,
      // se usa la propiedad de message para ir concatenando los errores en caso de haber, y el time_visible para
      // agrandar el tiempo de vista para que se pueda leer todo el mensaje.

      console.log(movies);
      this.moviesService.saveAll(movies).subscribe( response => {
        this.snackbar.open('Se agregaron las peliculas con exito.');
        console.log(response);
        this.uploadingMovies = !this.uploadingMovies;
        this.moviesSelected.clear();
        this.pendientRequest = false;
      }, (error: HttpErrorResponse) => {
        this.pendientRequest = false;
        this.snackbar.open(`${error.message}`, '', {
          duration: 3500, panelClass: ['error-snackbar']});
        this.uploadingMovies = !this.uploadingMovies;
      });
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  /*
    Cada que se seleccione una opcion del componente Select, se ejecutara la siguiente funcion
    que obtendra todas las peliculas de determinado anio del servidor encargado de almacenar todas
    las peliculas.
  */
  yearSelected() {
    if (!this.pendientRequest) {
      this.pendientRequest = true;
      this.gettingMovies = !this.gettingMovies;
      this.moviesService.getAllFromMovieServer(this.year_selected).subscribe({
        next: (response => {
          if (response.status.includes('Success')) {
            this.TREE_DATA = [];
            response.movies.forEach( movie => {
              this.TREE_DATA.push({
                name: movie.name,
                children: [
                  {
                    name: movie.name,
                    movieLinks: movie.movieLinks,
                    originalName: movie.originalName,
                    synopsis: movie.synopsis,
                    length: +movie.length.toString().split('min')[0],
                    poster: movie.poster,
                    tags: movie.tags,
                    genres: movie.genres,
                    cast: movie.cast,
                    year: +movie.year,
                    modificationDate: movie.modificationDate
                  }
                ]
              });
            });
            this.dataSource.data = this.TREE_DATA;
            this.moviesSelected.clear();
            this.snackbar.open(response.message);
          } else {
            this.snackbar.open(response.message, '', {
              duration: 3000, panelClass: ['error-snackbar']});
          }
          this.pendientRequest = false;
          this.gettingMovies = !this.gettingMovies;
        }),
        error: ((error: HttpErrorResponse) => {
          this.pendientRequest = false;
          this.gettingMovies = !this.gettingMovies;
          this.snackbar.open(error.message, '', {
            duration: 3000, panelClass: ['error-snackbar']});
        })
      });
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }

  selectAll() {
    if (!this.pendientRequest) {
      this.pendientRequest = true;
      const movies: MovieUniqueCheck[] = [];
      const moviesNodes = new Map<string, TreeNode>();
      this.dataSource.data.forEach( node => {
        movies.push(new MovieUniqueCheck(node.children[0].name, node.children[0].year));
        moviesNodes.set(node.children[0].name, node);
      });
      console.log(movies);
      this.moviesService.findIfAlreadyInDBWithNameAndYear(movies).subscribe({
        next: (response => {
          if (response.status === 'MoviesFound') {
            this.snackbar.open(response.message, '', {
              duration: 3500, panelClass: ['error-snackbar']});
          }
          response.responses.forEach( movie => {
            if (movie.status === 'NewMovie') {
              this.moviesSelected.set(this.treeNodeMap.get(moviesNodes.get(movie.name)), moviesNodes.get(movie.name));
            }
          });
          console.log(response);
          this.pendientRequest = false;
        }),
        error: ((err: HttpErrorResponse) => {
          this.pendientRequest = false;
          this.snackbar.open(`${err.message}`, '', {
            duration: 3500, panelClass: ['error-snackbar']});
        })
      });
    } else {
      this.snackbar.open('Otra operacion esta siendo procesada por favor espera a que termine.');
    }
  }
}
