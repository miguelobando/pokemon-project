import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activities } from '../../../entities/activities.entity';
import { OwnedPokemon } from '../../../entities/ownedPokemon.entity';
import { RegisteredPokemonEntity } from '../../../entities/registeredPokemon.entity';
import { Trades } from '../../../entities/trades.entity';
import { User } from '../../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GivePokemonService {
  constructor(
    @InjectRepository(OwnedPokemon)
    private readonly ownedPokemonRepository: Repository<OwnedPokemon>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Trades)
    private readonly tradesRepository: Repository<Trades>,
    @InjectRepository(RegisteredPokemonEntity)
    private readonly registeredPokemonRepository: Repository<RegisteredPokemonEntity>,
  ) {}

  async processGivePokemon(
    senderId: number,
    receptorId: number,
    pokemonId: string,
  ) {
    const queryRunner =
      this.tradesRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sender = await this.userRepository.findOne({
        where: { id: senderId },
      });
      if (!sender) throw new Error('Sender not found');

      const receptor = await this.userRepository.findOne({
        where: { id: receptorId },
      });
      if (!receptor) throw new Error('Receptor not found');

      const pokemon = await this.registeredPokemonRepository.findOne({
        where: { pokemon_id: pokemonId },
      });
      if (!pokemon) throw new Error('Pokemon not found');

      console.log(
        ` sender ${senderId},  receptorId ${receptorId}, pokemonId ${pokemonId}`,
      );

      const trade = await this.tradesRepository.findOne({
        where: {
          requested_pokemon_id: pokemonId,
          trader_id: receptorId,
          completed: false,
        },
      });
      if (!trade) throw new Error('Trade not found');

      const senderPokemon = await this.ownedPokemonRepository.findOne({
        where: {
          pokemon_id: pokemonId,
          pokemon_owner: senderId.toString(),
        },
      });
      if (!senderPokemon) throw new Error('Sender does not have that pokemon');

      // Update trade status
      trade.completed = true;
      await queryRunner.manager.save(Trades, trade);

      // Update pokemon owner
      senderPokemon.pokemon_owner = receptorId.toString();
      await queryRunner.manager.save(OwnedPokemon, senderPokemon);

      // Create notifications
      const notifications = [
        {
          description: `${sender.name} gave you a ${pokemon.pokemon_name}`,
          user_id: receptorId,
          is_readed: false,
          date: new Date(),
        },
        {
          description: `${receptor.name} received a ${pokemon.pokemon_name}`,
          user_id: senderId,
          is_readed: false,
          date: new Date(),
        },
      ];

      await queryRunner.manager.save(Activities, notifications);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error giving pokemon:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
