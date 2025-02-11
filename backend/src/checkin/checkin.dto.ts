import { IsNotEmpty, IsString, IsInt, IsDateString } from 'class-validator';

export class CheckinDto {
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsDateString()
  @IsNotEmpty()
  checkinDate: string;

  @IsInt()
  @IsNotEmpty()
  roomNumber: number;
}
