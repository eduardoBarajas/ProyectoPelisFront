import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListReviewsComponent } from './list-reviews/list-reviews.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { EditReviewComponent } from './edit-review/edit-review.component';

@NgModule({
  declarations: [ListReviewsComponent, AddReviewComponent, EditReviewComponent],
  imports: [
    CommonModule
  ]
})
export class ReviewsModule { }
