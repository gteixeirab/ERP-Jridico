import { IsString, IsNotEmpty, IsDateString, IsMilitaryTime } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsMilitaryTime()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  clientName: string;
}
