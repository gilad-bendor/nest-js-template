import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS if needed
  app.enableCors();
  
  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
