import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as MicroGear from 'microgear';
import { ConfigService } from '../config/config.service';

const NETPIE_CACHE_DIR = `${process.cwd()}/microgear`;
const NETPIE_CACHE_PATH = `${NETPIE_CACHE_DIR}/microgear-g1.cache`;

@Injectable()
export class MicroGearService implements OnModuleInit {
	private microgear?: MicroGear.Microgear;

	constructor(private readonly configService: ConfigService) {}

	public async onModuleInit(): Promise<void> {
		if (!fs.existsSync(NETPIE_CACHE_DIR)) {
			fs.mkdirSync(NETPIE_CACHE_DIR);
		}
		await this.init();
	}

	public reset(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.microgear.resetToken((result: any) => {
				resolve();
			});
		});
	}

	public publish(topic: string, message: string) {
		this.microgear.publish(topic, message);
	}
	private init(): Promise<MicroGear.Microgear> {
		const microgear = MicroGear.create({
			key: this.configService.netpieKey,
			secret: this.configService.netpieSecret,
			alias: 'nest'
		});
		microgear.setCachePath(NETPIE_CACHE_PATH);

		this.microgear = microgear;

		return new Promise((resolve, reject) => {
			const connected = () => {
				microgear.removeListener('connected', connected);
				microgear.removeListener('error', error);
				resolve(microgear);
			};
			const error = (err: Error) => {
				microgear.removeListener('connected', connected);
				microgear.removeListener('error', error);
				reject(err);
			};
			microgear.on('connected', connected);
			microgear.on('error', error);

			microgear.connect(this.configService.netpieAppID);
		});
	}
}
