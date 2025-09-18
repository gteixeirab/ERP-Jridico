import { IsEmail, IsNotEmpty, IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsIn(['PESSOA_FISICA', 'PESSOA_JURIDICA'])
  @IsNotEmpty()
  type: 'PESSOA_FISICA' | 'PESSOA_JURIDICA';

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
