import { MicroGearModule } from './microgear.module';
import { ConfigModule } from '../config/config.module';
import { Test, TestingModule } from '@nestjs/testing';
import { MicroGearService } from './microgear.service';

describe('MicroGearService', () => {
  let service: MicroGearService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [MicroGearModule],
      imports: [ConfigModule],
      providers: [MicroGearService],
    }).compile();

    service = module.get<MicroGearService>(MicroGearService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
