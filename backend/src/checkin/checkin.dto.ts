import { IsString, IsDateString, IsInt } from 'class-validator';

export class CheckinDto {
  @IsString()
  guestName: string;

  @IsDateString()
  checkinDate: string;

  @IsInt()
  roomNumber: number;
}
