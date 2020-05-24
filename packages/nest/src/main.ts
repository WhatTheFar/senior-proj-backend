import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

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
	SwaggerModule.setup('api-doc', app, document);

	await app.listen(3000);
}
bootstrap();
