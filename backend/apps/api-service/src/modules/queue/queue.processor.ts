// src/queue/queue.processor.ts

import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('task-queue')
export class QueueProcessor {
  @Process('task-job')
  async handleTask(job: Job) {
    console.log('Processing job:', job.data);
  }
}
