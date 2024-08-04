import { Entity, PrimaryColumn } from 'typeorm';

@Entity('owned_pokemon')
export class OwnedPokemon {
  @PrimaryColumn({ type: 'varchar' })
  pokemon_id: string;

  @PrimaryColumn({ type: 'varchar' })
  pokemon_owner: string;
}
