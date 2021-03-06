import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, InjectSchedule, NestSchedule, Schedule } from 'nest-schedule';
import { ConfigService } from './../config/config.service';
import { IotService } from './iot.service';

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
		private readonly configService: ConfigService
	) {}

	public onApplicationBootstrap() {
		this.schedule.scheduleCronJob(
			'iot',
			this.configService.iotCron,
			this.iotSensorSyncronizationCronJob.bind(this)
		);
	}

	public async iotSensorSyncronizationCronJob(): Promise<boolean> {
		const date = new Date();
		console.log(
			`${date.toISOString()} : IoT Syncronization, this will be run every 1 minute!`
		);
		this.iotService.publishTimeSyncronization(date);
		return false;
	}
}
