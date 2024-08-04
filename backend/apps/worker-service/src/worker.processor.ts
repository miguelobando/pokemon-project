import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { getPokemonsWorkerService } from './getPokemonsWorker.service';
import { AssignPokemonsWorkerService } from './assignPokemonsWorker.service';

@Processor('task-queue')
export class WorkerProcessor {
  constructor(
    private readonly workerService: getPokemonsWorkerService,
    private readonly assignPokemon: AssignPokemonsWorkerService,
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
}
