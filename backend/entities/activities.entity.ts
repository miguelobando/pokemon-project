import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('activities')
export class Activities {
  @PrimaryGeneratedColumn()
  activity_id: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  is_readed: boolean = false;

  @Column()
  user_id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
