import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Checkin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  guestName: string;

  @Column()
  checkinDate: Date;

  // Aggiungi altri campi necessari
}
