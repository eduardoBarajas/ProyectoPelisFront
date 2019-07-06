export class User {
    idUser: number;
    name: string;
    username: string;
    password: string;
    email: string;
    creationDate: string;
    authority: number;
    enabled: number;

    constructor() {
        this.idUser = 0;
        this.name = '';
        this.username = '';
        this.password = '';
        this.email = '';
        this.creationDate = '';
        this.authority = 2;
        this.enabled = 1;
    }
}