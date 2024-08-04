import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RegisteredPokemonEntity } from './registeredPokemon.entity'; // Adjust the import path as needed
import { User } from './user.entity';

@Entity('trades')
export class Trades {
  @PrimaryGeneratedColumn()
  exchange_id: number;

  @Column()
  requested_pokemon_id: string;

  @Column()
  trader_id: number;

  @Column()
  completed: boolean = false;

  @ManyToOne(() => RegisteredPokemonEntity, { eager: true })
  @JoinColumn({
    name: 'requested_pokemon_id',
    referencedColumnName: 'pokemon_id',
  })
  requestedPokemon: RegisteredPokemonEntity;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'trader_id' })
  trader: User;
}
