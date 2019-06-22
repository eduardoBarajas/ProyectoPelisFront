export interface IResponse<T> {
    status: string;
    message: string;
    responses: Array<T>;
}
