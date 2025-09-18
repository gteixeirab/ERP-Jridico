import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token deve ser uma string' })
  @IsNotEmpty({ message: 'Refresh token é obrigatório' })
  refreshToken: string;
}

export class TokensResponseDto {
  accessToken: string | null;
  refreshToken: string | null;
}

export class AuthResponseDto extends TokensResponseDto {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}

export class LogoutResponseDto {
  success: boolean;
  message: string;
}
