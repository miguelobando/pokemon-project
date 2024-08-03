import { NestFactory } from '@nestjs/core';
import { ApiServiceModule } from './api-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiServiceModule);
  await app.listen(3000);
}
bootstrap();
