import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { getPokemonsService } from './getPokemons.service';
import { AssignPokemonsService } from './assignPokemons.service';
import { RequestTradeService } from './requestTrade.service';

@Processor('task-queue')
export class WorkerProcessor {
  constructor(
    private readonly workerService: getPokemonsService,
    private readonly assignPokemon: AssignPokemonsService,
    private readonly requestTrade: RequestTradeService,
  ) {}

  @Process('get-pokemons')
  async handleTask(job: Job) {
    console.log('Processing job:', job.data);
    try {
      const result = await this.workerService.processGetAllPokemon();
      return result;
    } catch (error) {
      console.error('Job failed:', error);
      throw error;
    }
  }

  @Process('assign-pokemons-to-user')
  async handleAssignPokemonsToUser(job: Job) {
    console.log(`Assigning pokemons to user with id: ${job.data.id}`);
    try {
      const result = await this.assignPokemon.processAssignPokemonsToUser(
        job.data.id,
      );
      return result;
    } catch (error) {
      console.error('Job failed:', error);
      throw error;
    }
  }

  @Process('request-trade')
  async handleRequestTrade(job: Job) {
    try {
      const result = await this.requestTrade.processRequestTrade(
        job.data.userId,
        job.data.pokemonId,
      );
      return result;
    } catch (error) {
      console.error('Job failed:', error);
      throw error;
    }
  }
}
