// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for your Vite dev server
  app.enableCors({
    origin: ['http://localhost:5173'], // frontend origin
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // set true only if you use cookies
  });

  await app.listen(3000);
}
bootstrap();
