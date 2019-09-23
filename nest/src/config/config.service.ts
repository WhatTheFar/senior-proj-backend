import * as dotenv from 'dotenv';
import * as fs from 'fs';

function getEnv(key: string) {
  return process.env[key];
}

export class ConfigService {
  private readonly envConfig: { [key: string]: string } = {};
  constructor() {
    const path = `${process.cwd()}/.env`;
    if (fs.existsSync(path)) {
      this.envConfig = dotenv.parse(fs.readFileSync(path), { debug: true });
    }
  }

  get(key: string): string | undefined {
    return this.envConfig[key] || getEnv(key);
  }

  getOrThrows(key: string): string | undefined {
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
}
