import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // dev-friendly BigInt → number in JSON to avoid 500s
  (BigInt.prototype as any).toJSON = function () { return Number(this); };

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });
  await app.listen(3000);
}
bootstrap();
