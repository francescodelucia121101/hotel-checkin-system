import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Checkin {
  @PrimaryGeneratedColumn()
  id!: number;  // TypeORM gestisce automaticamente l'assegnazione di questo valore

  @Column()
  guestName!: string;

  @Column()
  checkinDate!: Date;
}
