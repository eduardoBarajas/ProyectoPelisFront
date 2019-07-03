import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IComment } from 'src/app/entities/IComment';
import { Comment } from 'src/app/entities/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  apiUrl = 'http://localhost:8080/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }
  save(comment: Comment) {
    return this.httpClient.post<IComment>('http://localhost:8080/comments/', comment, this.httpOptions);
  }
  getAllByIdMovie(idMovie: number) {
    return this.httpClient.get(`${this.apiUrl}comments/movie/${idMovie}`);
  }
  update(comment: Comment) {
    return this.httpClient.put<IComment>(`${this.apiUrl}comments/movie/comment/${comment.idComment}`, comment, this.httpOptions);
  }
  deleteById(idComment: number) {
    return this.httpClient.delete<IComment>(`${this.apiUrl}comments/movie/comment/${idComment}`);
  }
}