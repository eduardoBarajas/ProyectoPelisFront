import { Injectable } from '@angular/core';
import { Review } from '../../entities/Review';
import { IReview } from '../../entities/IReview';
import { HttpHeaders, HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private httpClient: HttpClient) { }
  save(review: Review) {
    return this.httpClient.post<IReview>(`${environment.apiUrl}reviews/`, review, this.httpOptions);
  }
  getAllByIdMovie(idMovie: number) {
    return this.httpClient.get(`${environment.apiUrl}reviews/movie/${idMovie}`);
  }
  update(review: Review) {
    return this.httpClient.put<IReview>(`${environment.apiUrl}reviews/movie/review/${review.idReview}`, review, this.httpOptions);
  }
  deleteById(idReview: number) {
    return this.httpClient.delete<IReview>(`${environment.apiUrl}reviews/movie/review/${idReview}`);
  }
}
