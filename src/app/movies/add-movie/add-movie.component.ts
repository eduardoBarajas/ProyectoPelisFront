import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { Movie } from 'src/app/entities/Movie';
import { MoviesService } from '../movies.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

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

// tslint:disable-next-line: variable-name
  movie_node_fields = ['name', 'originalName', 'synopsis', 'length', 'poster', 'tags', 'genres',
  'cast', 'year', 'modificationDate'];
  years = [];
// tslint:disable-next-line: variable-name
  year_selected = 2019;
  TREE_DATA: TreeNode[];

  // el siguiente map es utilizado para tener una referencia del nodo, utilizando el nodo anidado como key.
  flatNodeMap = new Map<FlatNode, TreeNode>();
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
    this.flatNodeMap.set(flatnode, node);
    return flatnode;
  }

  constructor(private moviesService: MoviesService, private snackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.treeControl = new FlatTreeControl<FlatNode>(node => node.level,
      node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    for (let i = 1925; i <= 2019; i++) {
      this.years.push(i);
    }
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  /*
    La funcion movieSelected tendra la funcion de insertar y extraer nodos de la lista de peliculas seleccionadas.
    recibe como parametro un nodo anidado(FlatNode).
  */
  movieSelected(node: FlatNode) {
    if (this.moviesSelected.has(node)) {
      this.moviesSelected.delete(node);
    } else {
      this.moviesSelected.set(node, this.flatNodeMap.get(node));
    }
  }

  saveMovies() {
    // si no se ha seleccionado ninguna pelicula se regresa el mensaje de error y se cancela el metodo.
    if (this.moviesSelected.size < 1) {
      this.snackbar.open('No se selecciono ninguna pelicula', '', {
        duration: 3000, panelClass: ['error-snackbar']});
      return;
    }
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
      movies.push(movie);
    });
    this.moviesService.saveMovies(movies).subscribe({
      next: (response => {
        if (response.status.includes('Success')) {
          this.snackbar.open(response.message);
        } else {
          this.snackbar.open(response.message, '', {
            duration: 3000, panelClass: ['error-snackbar']});
        }
      }),
      error: ((error: HttpErrorResponse) => {
        this.snackbar.open(error.message, '', {
          duration: 3000, panelClass: ['error-snackbar']});
      })
    });
  }

  /*
    Cada que se seleccione una opcion del componente Select, se ejecutara la siguiente funcion
    que obtendra todas las peliculas de determinado anio del servidor encargado de almacenar todas
    las peliculas.
  */
  yearSelected() {
    this.moviesService.getMoviesFromMovieServer(this.year_selected).subscribe({
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
        }),
        error: ((error: HttpErrorResponse) => {
          this.snackbar.open(error.message, '', {
            duration: 3000, panelClass: ['error-snackbar']});
        })
     });
  }
}
