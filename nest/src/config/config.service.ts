import * as dotenv from 'dotenv';

function getEnv(key: string): string | null {
  const value = process.env[key];
  if (value) {
    return value;
  } else {
    return null;
  }
}

function getEnvOrThrows(key: string): string {
  const value = getEnv(key);
  if (value) {
    return value;
  } else {
    throw new Error(`Unable to read "${key}" environment`);
  }
}

export class ConfigService {
  constructor() {
    dotenv.config();
  }

  get(key: string): string {
    return getEnv(key);
  }
  getDatabaseHostName(): string {
    return getEnvOrThrows('DB_HOST');
  }
  getDatabaseUser(): string {
    return getEnvOrThrows('DB_USER');
  }
  getDatabasePassword(): string {
    return getEnvOrThrows('DB_PASSWORD');
  }
  getNetpieAppID(): string {
    return getEnvOrThrows('NETPIE_APPID');
  }
  getNetpieKey(): string {
    return getEnvOrThrows('NETPIE_KEY');
  }
  getNetpieSecret(): string {
    return getEnvOrThrows('NETPIE_SECRET');
  }
}
