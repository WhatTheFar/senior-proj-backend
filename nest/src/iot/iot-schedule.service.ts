import { IotService } from './iot.service';
import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';

@Injectable() // Only support SINGLETON scope
export class IotScheduleService extends NestSchedule {
  constructor(private readonly iotService: IotService) {
    super();
  }

  @Cron('*/1 * * * *')
  async iotSensorSyncronizationCronJob() {
    const date = new Date();
    console.log(
      `${date.toISOString()} : IoT Syncronization, this will be run every 1 minute!`,
    );
    this.iotService.publishTimeSyncronization(date);
  }
}
