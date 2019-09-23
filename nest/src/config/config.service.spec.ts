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

const path = `${process.cwd()}/.env`;
const pathOld = `${process.cwd()}/.env.old`;

describe('ConfigService', () => {
  let service: ConfigService;

  beforeAll(() => {
    if (fs.existsSync(path)) {
      fs.renameSync(path, pathOld);
    }

    const envString = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    fs.writeFileSync(path, envString);
  });

  afterAll(() => {
    fs.renameSync(pathOld, path);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect(service.databaseHostName).toEqual(env.DB_HOST);
    expect(service.databaseUser).toEqual(env.DB_USER);
    expect(service.databasePassword).toEqual(env.DB_PASSWORD);

    expect(service.netpieAppID).toEqual(env.NETPIE_APPID);
    expect(service.netpieKey).toEqual(env.NETPIE_KEY);
    expect(service.netpieSecret).toEqual(env.NETPIE_SECRET);
  });
});
