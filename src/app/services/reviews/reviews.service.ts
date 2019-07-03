import { Injectable } from '@angular/core';
import { Review } from '../../entities/Review';
import { IReview } from '../../entities/IReview';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  apiUrl = 'http://localhost:8080/reviews/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private httpClient: HttpClient) { }
  save(review: Review) {
    return this.httpClient.post<IReview>('http://localhost:8080/reviews/', review, this.httpOptions);
  }
  getAllByIdMovie(idMovie: number) {
    return this.httpClient.get(`${this.apiUrl}movie/${idMovie}`);
  }
  update(review: Review) {
    return this.httpClient.put<IReview>(`${this.apiUrl}movie/review/${review.idReview}`, review, this.httpOptions);
  }
  deleteById(idReview: number) {
    return this.httpClient.delete<IReview>(`${this.apiUrl}movie/review/${idReview}`);
  }
}
