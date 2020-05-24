import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from 'nest-schedule';
import { ConfigModule } from './../config/config.module';
import { MicroGearModule } from './../microgear/microgear.module';
import { IotScheduleService } from './iot-schedule.service';
import { IotController } from './iot.controller';
import { IOT_COLLECTION, IOT_MODEL, IotSchema } from './iot.model';
import { IotService } from './iot.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: IOT_MODEL, schema: IotSchema, collection: IOT_COLLECTION }
		]),
		MicroGearModule,
		ConfigModule
	],
	controllers: [IotController],
	providers: [IotService, IotScheduleService]
})
export class IotModule {}
