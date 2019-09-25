import { CO2SensorDto, MultiSensorsDto } from './iot.dto';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { IotController } from './iot.controller';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { IotService } from './iot.service';

describe('Iot Controller', () => {
  let app: INestApplication;
  let controller: IotController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IotController],
      providers: [IotService],
    })
      .overrideProvider(IotService)
      .useValue({
        saveCO2: () => {
          return;
        },
        saveMultiSensors: () => {
          return;
        },
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    controller = module.get<IotController>(IotController);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /sensor/co2', () => {
    const endpoint = '/iot/sensor/co2';
    const validBody: CO2SensorDto = {
      date: new Date().toISOString(),
      co2: 100,
    };

    it('valid args, should OK', () => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send(validBody)
        .expect(200);
    });

    it('invalid body, should Error', () => {
      const body = {
        ...validBody,
        date: 'string',
        co2: 'string',
      };
      return (
        request(app.getHttpServer())
          .post(endpoint)
          .send(body)
          // .expect(res => {
          //   console.log(JSON.stringify(res.body, null, 4));
          // })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ property: 'co2' }),
                expect.objectContaining({ property: 'date' }),
              ]),
            );
          })
      );
    });
  });

  describe('POST /sensor/multi', () => {
    const endpoint = '/iot/sensor/multi';

    const validBody: MultiSensorsDto = {
      device: 1,
      date: new Date().toISOString(),
      temp: 40.2,
      hum: 35.2,
      light: 1000,
    };

    it('valid args, should OK', () => {
      return (
        request(app.getHttpServer())
          .post(endpoint)
          .send(validBody)
          // .expect(res => {
          //   console.log(JSON.stringify(res.body, null, 4));
          // })
          .expect(200)
      );
    });

    it('invalid body, should Error', () => {
      const body = {
        ...validBody,
        device: 'string',
        date: 'string',
        temp: 'string',
        hum: 'string',
        light: 'string',
      };
      return (
        request(app.getHttpServer())
          .post(endpoint)
          .send(body)
          // .expect(res => {
          //   console.log(JSON.stringify(res.body, null, 4));
          // })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ property: 'device' }),
                expect.objectContaining({ property: 'date' }),
                expect.objectContaining({ property: 'temp' }),
                expect.objectContaining({ property: 'hum' }),
                expect.objectContaining({ property: 'light' }),
              ]),
            );
          })
      );
    });
  });
});
