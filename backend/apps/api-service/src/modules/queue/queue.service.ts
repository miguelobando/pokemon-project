import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('task-queue') private taskQueue: Queue) {}

  onModuleInit() {
    this.taskQueue.on('failed', (job, err) => {
      console.log(
        `Job ${job.id} failed with error: ${err.message}. Retried ${job.attemptsMade} times.`,
      );
    });

    this.taskQueue.on('stalled', (job) => {
      console.log(
        `Job ${job.id} is stalled. Retried ${job.attemptsMade} times.`,
      );
    });

    this.taskQueue.on('waiting', (jobId) => {
      console.log(`Job ${jobId} is waiting.`);
    });

    this.taskQueue.on('active', (job) => {
      console.log(`Job ${job.id} is now active.`);
    });

    this.taskQueue.on('finished', (job) => {
      console.log(`Job ${job.id} completed`);
    });
  }

  async getPokemons() {
    try {
      const job = await this.taskQueue.add(
        'get-pokemons',
        {
          message: 'Get pokemons',
        },
        {
          attempts: 5,
          backoff: 5000,
        },
      );
      const result = await job.finished();
      console.log('Get pokemons job finished:');
      return result;
    } catch (error) {
      console.error('Error getting pokemons:', error);
      throw error;
    }
  }
}
