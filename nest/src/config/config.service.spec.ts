import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import * as fs from 'fs';

const env = {
  DB_HOST: 'db',
  DB_USER: 'user',
  DB_PASSWORD: 'password',
  NETPIE_APPID: 'seniorproj',
  NETPIE_KEY: 'key',
  NETPIE_SECRET: 'secret',
};

describe('ConfigService', () => {
  let service: ConfigService;

  beforeAll(async () => {
    const path = `${process.cwd()}/.env`;
    const envString = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    fs.writeFileSync(path, envString);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect(service.getDatabaseHostName()).toEqual(env.DB_HOST);
    expect(service.getDatabaseUser()).toEqual(env.DB_USER);
    expect(service.getDatabasePassword()).toEqual(env.DB_PASSWORD);

    expect(service.getNetpieAppID()).toEqual(env.NETPIE_APPID);
    expect(service.getNetpieKey()).toEqual(env.NETPIE_KEY);
    expect(service.getNetpieSecret()).toEqual(env.NETPIE_SECRET);
  });
});
