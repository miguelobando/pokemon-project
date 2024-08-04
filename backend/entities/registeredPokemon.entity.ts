import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('registered_pokemon')
export class RegisteredPokemonEntity {
  @PrimaryColumn({ type: 'varchar' })
  pokemon_id: string;

  @Column({ type: 'varchar' })
  pokemon_name: string;

  @Column({ type: 'varchar' })
  pokemon_type: string;

  @Column({ type: 'varchar' })
  pokemon_sprite: string;
}
