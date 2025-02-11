export class CheckinDto {
  guestName: string;
  checkinDate: string;
  roomNumber: number;

  constructor(guestName: string, checkinDate: string, roomNumber: number) {
    this.guestName = guestName;
    this.checkinDate = checkinDate;
    this.roomNumber = roomNumber;
  }
}
