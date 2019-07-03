export interface IReview {
    idReview: number;
    grade: number;
	review: string;
    publishedDate: string;
    publishedTime: string;
    username: string;
	reviewTitle: string;
    idUser: number;
    idMovie: number;
    status: string;
    message: string;
}