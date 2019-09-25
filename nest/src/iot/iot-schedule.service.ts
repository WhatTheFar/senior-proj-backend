import { IotService } from './iot.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, NestSchedule, Schedule, InjectSchedule } from 'nest-schedule';

// @Injectable() // Only support SINGLETON scope
// export class IotScheduleService extends NestSchedule {
//   constructor(private readonly iotService: IotService) {
//     super();
//   }

//   @Cron('*/1 * * * *')
//   async iotSensorSyncronizationCronJob() {
//     const date = new Date();
//     console.log(
//       `${date.toISOString()} : IoT Syncronization, this will be run every 1 minute!`,
//     );
//     this.iotService.publishTimeSyncronization(date);
//   }
// }

@Injectable() // Only support SINGLETON scope
export class IotScheduleService implements OnApplicationBootstrap {
  constructor(
    @InjectSchedule() private readonly schedule: Schedule,
    private readonly iotService: IotService,
  ) {}

  onApplicationBootstrap() {
    this.schedule.scheduleCronJob(
      'iot',
      // '*/10 * * * * *',
      '*/1 * * * *',
      this.iotSensorSyncronizationCronJob.bind(this),
    );
  }

  async iotSensorSyncronizationCronJob(): Promise<boolean> {
    const date = new Date();
    console.log(
      `${date.toISOString()} : IoT Syncronization, this will be run every 1 minute!`,
    );
    this.iotService.publishTimeSyncronization(date);
    return false;
  }
}
