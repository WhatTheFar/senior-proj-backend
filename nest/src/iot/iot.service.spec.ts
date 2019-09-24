import { MicroGearModule } from './../microgear/microgear.module';
import { Test, TestingModule } from '@nestjs/testing';
import { IotService } from './iot.service';

describe('IotService', () => {
  let service: IotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MicroGearModule],
      providers: [IotService],
    }).compile();

    service = module.get<IotService>(IotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
