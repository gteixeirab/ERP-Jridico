import { IsString, IsNotEmpty, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateKanbanTaskDto {
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title: string;

  @IsString({ message: 'O ID da coluna deve ser uma string' })
  @IsNotEmpty({ message: 'O ID da coluna é obrigatório' })
  @IsUUID(4, { message: 'O ID da coluna deve ser um UUID válido' })
  columnId: string;

  @IsArray({ message: 'As tags devem ser um array de strings' })
  @IsOptional()
  tags?: string[];
}
