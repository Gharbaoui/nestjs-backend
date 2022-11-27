import { ValidationPipe } from '@nestjs/common';
import {NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.VUE_APP_FRONTEND_API || `http://localhost:3000`,
      process.env.VUE_APP_FRONTEND_API_EDIT || `http://localhost:4000`,
    ]
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
