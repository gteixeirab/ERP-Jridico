export interface JwtPayload {
    sub: string;
    userId?: string;
    email: string;
    [key: string]: any;
}
