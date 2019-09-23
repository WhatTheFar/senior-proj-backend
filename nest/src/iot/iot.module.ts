import { MicroGearModule } from './../microgear/microgear.module';
import { Module } from '@nestjs/common';
import { IotController } from './iot.controller';
import { ScheduleModule } from 'nest-schedule';
import { IotService } from './iot.service';
import { IotScheduleService } from './iot-schedule.service';

@Module({
  imports: [ScheduleModule.register(), MicroGearModule],
  controllers: [IotController],
  providers: [IotService, IotScheduleService],
})
export class IotModule {}
