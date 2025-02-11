import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hotelName: string;

  @Column()
  managerEmail: string;

  @Column()
  password: string;

  @Column()
  wubookApiKey: string;

  @Column()
  stripeApiKey: string;

  @Column()
  hikvisionApiKey: string;

  // Costruttore per inizializzare le proprietà
  constructor(
    id: number,
    hotelName: string,
    managerEmail: string,
    password: string,
    wubookApiKey: string,
    stripeApiKey: string,
    hikvisionApiKey: string,
  ) {
    this.id = id;
    this.hotelName = hotelName;
    this.managerEmail = managerEmail;
    this.password = password;
    this.wubookApiKey = wubookApiKey;
    this.stripeApiKey = stripeApiKey;
    this.hikvisionApiKey = hikvisionApiKey;
  }
}
