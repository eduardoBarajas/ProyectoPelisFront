export class Review {
    idReview: number;
    grade: number;
	review: string;
    publishedDate: string;
    publishedTime: string;
    username: string;
	reviewTitle: string;
    idUser: number;
    idMovie: number;

    setReview(review: Review) {
        this.idReview = review.idReview;
        this.grade = review.grade;
        this.review = review.review;
        this.publishedDate = review.publishedDate;
        this.publishedTime = review.publishedTime;
        this.username = review.username;
        this.reviewTitle = review.reviewTitle;
        this.idUser = review.idUser;
        this.idMovie = review.idMovie;
    }
}