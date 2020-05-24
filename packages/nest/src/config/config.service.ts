import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

function getEnv(key: string) {
	return process.env[key];
}

export class ConfigService implements MongooseOptionsFactory {
	private readonly envConfig: { [key: string]: string } = {};
	constructor(filePath?: string) {
		if (fs.existsSync(filePath)) {
			this.envConfig = dotenv.parse(fs.readFileSync(filePath), { debug: true });
		}
	}

	public createMongooseOptions(): MongooseModuleOptions {
		const host = this.databaseHostName;
		const user = this.databaseUser;
		const password = this.databasePassword;
		return {
			uri: `mongodb://${user}:${password}@${host}:27017`,
			dbName: 'seniorproj',
			useNewUrlParser: true,
			useUnifiedTopology: true
		};
	}

	public get(key: string): string | undefined {
		return this.envConfig[key] || getEnv(key);
	}

	public getOrThrows(key: string): string | undefined {
		const value = this.get(key);
		if (value) {
			return value;
		} else {
			throw new Error(`Unable to get "${key}" config`);
		}
	}

	get databaseHostName(): string {
		return this.getOrThrows('DB_HOST');
	}
	get databaseUser(): string {
		return this.getOrThrows('DB_USER');
	}
	get databasePassword(): string {
		return this.getOrThrows('DB_PASSWORD');
	}
	get netpieAppID(): string {
		return this.getOrThrows('NETPIE_APPID');
	}
	get netpieKey(): string {
		return this.getOrThrows('NETPIE_KEY');
	}
	get netpieSecret(): string {
		return this.getOrThrows('NETPIE_SECRET');
	}
	get iotCron(): string {
		return this.getOrThrows('IOT_CRON');
	}
}
