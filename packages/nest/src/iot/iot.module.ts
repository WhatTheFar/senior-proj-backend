import { ConfigModule } from './../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MicroGearModule } from './../microgear/microgear.module';
import { Module } from '@nestjs/common';
import { IotController } from './iot.controller';
import { ScheduleModule } from 'nest-schedule';
import { IotService } from './iot.service';
import { IotScheduleService } from './iot-schedule.service';
import { IotSchema, IOT_MODEL, IOT_COLLECTION } from './iot.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IOT_MODEL, schema: IotSchema, collection: IOT_COLLECTION },
    ]),
    MicroGearModule,
    ConfigModule,
  ],
  controllers: [IotController],
  providers: [IotService, IotScheduleService],
})
export class IotModule {}
