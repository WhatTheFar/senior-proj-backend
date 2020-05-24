import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from 'nest-schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { IotModule } from './iot/iot.module';
import { MicroGearModule } from './microgear/microgear.module';

@Module({
	imports: [
		IotModule,
		MicroGearModule,
		ConfigModule,
		ScheduleModule.register(),
		MongooseModule.forRootAsync({
			useClass: ConfigService
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
