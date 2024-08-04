import { Injectable } from '@nestjs/common';
import { RegisteredPokemonEntity } from '../../../entities/registeredPokemon.entity';
import { User } from '../../../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activities } from '../../../entities/activities.entity';
import { Trades } from '../../../entities/trades.entity';
import { OwnedPokemon } from './../../../entities/ownedPokemon.entity';

@Injectable()
export class RequestTradeService {
  constructor(
    @InjectRepository(RegisteredPokemonEntity)
    private readonly registeredPokemonRepository: Repository<RegisteredPokemonEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Trades)
    private readonly tradesRepository: Repository<Trades>,
    @InjectRepository(Activities)
    private readonly activitiesRepository: Repository<Activities>,
    @InjectRepository(OwnedPokemon)
    private readonly ownedPokemonRepository: Repository<OwnedPokemon>,
  ) {}

  async processRequestTrade(userId: number, pokemonId: string) {
    const queryRunner =
      this.tradesRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Check if pokemon exists
      const pokemon = await this.registeredPokemonRepository.findOne({
        where: { pokemon_id: pokemonId },
      });
      if (!pokemon) {
        throw new Error('Pokemon not found');
      }

      // Insert trade into database
      const newTrade = new Trades();
      newTrade.requested_pokemon_id = pokemonId;
      newTrade.trader_id = userId;
      newTrade.completed = false;
      await queryRunner.manager.save(newTrade);

      // Notify to users that have that pokemon
      await this.notifyUsers(pokemonId, user.name);

      await queryRunner.commitTransaction();

      console.log(`Trade ${pokemonId} requested by user ${userId}`);

      return { success: true };
    } catch (error) {
      // If something goes wrong, rollback the transaction
      await queryRunner.rollbackTransaction();
      console.error('Error requesting trade:', error);
      throw error; // Re-throw the original error
    } finally {
      await queryRunner.release();
    }
  }

  async notifyUsers(pokemonId: string, userName: string) {
    const queryRunner =
      this.activitiesRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get pokemon details
      const pokemonDetails = await this.registeredPokemonRepository.findOne({
        where: { pokemon_id: pokemonId },
      });

      if (!pokemonDetails) {
        throw new Error('Pokemon not found');
      }

      // Get all users that have that pokemon
      const users = await this.ownedPokemonRepository.find({
        where: { pokemon_id: pokemonId },
      });

      const usersToNotify = users.map((user) => user.pokemon_owner);

      // Create the activity for each user in parallel
      await Promise.all(
        usersToNotify.map(async (userId) => {
          const newActivity = new Activities();
          newActivity.description = `${userName} wants a ${pokemonDetails.pokemon_name}`;
          newActivity.user_id = parseInt(userId, 10);
          newActivity.is_readed = false;
          newActivity.date = new Date();
          await queryRunner.manager.save(newActivity);
        }),
      );

      await queryRunner.commitTransaction();
      console.log(
        `Users notified: ${usersToNotify.length} from trade ${pokemonDetails.pokemon_id} `,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error notifying users:', error);
    } finally {
      await queryRunner.release();
    }
  }
}
