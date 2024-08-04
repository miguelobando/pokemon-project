import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Trades } from './trades.entity';
import { Activities } from './activities.entity';

@Entity('users', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gender: string;

  @OneToMany(() => Trades, (trade) => trade.trader)
  trades: Trades[];

  @OneToMany(() => Activities, (activity) => activity.user)
  activities: Activities[];
}
