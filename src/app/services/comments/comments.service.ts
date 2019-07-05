import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IComment } from 'src/app/entities/IComment';
import { Comment } from 'src/app/entities/Comment';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }
  save(comment: Comment) {
    return this.httpClient.post<IComment>(`${environment.apiUrl}comments/`, comment, this.httpOptions);
  }
  getAllByIdMovie(idMovie: number) {
    return this.httpClient.get(`${environment.apiUrl}comments/movie/${idMovie}`);
  }
  update(comment: Comment) {
    return this.httpClient.put<IComment>(`${environment.apiUrl}comments/movie/comment/${comment.idComment}`, comment, this.httpOptions);
  }
  deleteById(idComment: number) {
    return this.httpClient.delete<IComment>(`${environment.apiUrl}comments/movie/comment/${idComment}`);
  }
}