export class Comment {
    idComment: number;
    comment: string;
    publishedDate: string;
    publishedTime: string;
    idUser: number;
    idMovie: number;
    username: string;

    setComment(comment: Comment) {
        this.idComment = comment.idComment;
        this.comment = comment.comment;
        this.publishedDate = comment.publishedDate;
        this.publishedTime = comment.publishedTime;
        this.idMovie = comment.idMovie;
        this.username = comment.username;
        this.idUser = comment.idUser;
    }
}
