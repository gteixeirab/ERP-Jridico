import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateKanbanColumnDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  columnType?: string;

  @IsOptional()
  sortOrder?: number;
}
