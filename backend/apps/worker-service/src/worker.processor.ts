import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { getPokemonsWorkerService } from './getPokemonsWorker.service';

@Processor('task-queue')
export class WorkerProcessor {
  constructor(private readonly workerService: getPokemonsWorkerService) {}

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
}
