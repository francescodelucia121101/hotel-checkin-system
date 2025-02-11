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
  password: string;  // Criptare la password in produzione

  @Column()
  wubookApiKey: string;

  @Column()
  stripeApiKey: string;

  @Column()
  hikvisionApiKey: string;
}
