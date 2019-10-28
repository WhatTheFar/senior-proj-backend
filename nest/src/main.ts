import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

function getSwaggerSchemes(): Array<'http' | 'https'> {
  switch (process.env.NODE_ENV) {
    case 'development':
      return ['http'];
    case 'production':
      return ['https'];
    default:
      return ['http'];
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Senior Project')
    .setDescription('The seniorproj API description')
    .setVersion('1.0')
    .setSchemes(...getSwaggerSchemes())
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
