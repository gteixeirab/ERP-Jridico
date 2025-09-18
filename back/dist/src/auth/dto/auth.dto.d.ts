export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class TokensResponseDto {
    accessToken: string | null;
    refreshToken: string | null;
}
export declare class AuthResponseDto extends TokensResponseDto {
    success: boolean;
    message: string;
    user: {
        id: string;
        email: string;
        name: string;
    } | null;
}
export declare class LogoutResponseDto {
    success: boolean;
    message: string;
}
