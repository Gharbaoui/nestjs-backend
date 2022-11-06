import { ValidationPipe } from '@nestjs/common';
import {NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.VUE_APP_FRONTEND_API || `http://localhost:3000`
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
