import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;
}
