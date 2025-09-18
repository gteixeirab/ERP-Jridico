export interface UserRequest extends Request {
    user: {
        userId: string;
        email: string;
        [key: string]: any;
    };
}
