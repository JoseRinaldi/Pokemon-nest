import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2')

  //validaciones de forma global
  app.useGlobalPipes( 
    new ValidationPipe({
    whitelist: true,//elimina info basura que no se requiere
    forbidNonWhitelisted: true,//emite un error si se manda info que no se pide
    })
   )


  await app.listen(3000);
}
bootstrap();
