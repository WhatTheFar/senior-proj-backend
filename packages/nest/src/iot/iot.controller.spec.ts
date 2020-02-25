import { CO2SensorDto, MultiSensorsDto, PeopleDto } from './iot.dto';
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
        savePeopleNumber: () => {
          return;
        },
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

  const date = new Date().toISOString();
  const actualDate = new Date().toISOString();
  const device = 1;

  const people = 4;

  const co2 = 123.456;

  const temp = 42.5;
  const hum = 42.5;
  const light = 100.2;

  describe('POST /sensor/people', () => {
    const endpoint = '/iot/sensor/people';
    const validBody: PeopleDto = {
      date,
      actualDate,
      people,
    };

    it('valid args, should OK', () => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send(validBody)
        .expect(201);
    });

    it('invalid body, should Error', () => {
      const body: Record<keyof PeopleDto, any> = {
        date: 1,
        actualDate: 'string',
        people: 1.1,
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
            expect(res.body.message.length).toEqual(3);
            expect(res.body.message).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ property: 'date' }),
                expect.objectContaining({ property: 'actualDate' }),
                expect.objectContaining({ property: 'people' }),
              ]),
            );
          })
      );
    });
  });

  describe('POST /sensor/co2', () => {
    const endpoint = '/iot/sensor/co2';
    const validBody: CO2SensorDto = {
      date,
      actualDate,
      device,
      co2,
    };

    it('valid args, should OK', () => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send(validBody)
        .expect(200);
    });

    it('invalid body, should Error', () => {
      const body: Record<keyof CO2SensorDto, any> = {
        date: 1,
        actualDate: 'string',
        device: 'string',
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
            expect(res.body.message.length).toEqual(4);
            expect(res.body.message).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ property: 'date' }),
                expect.objectContaining({ property: 'actualDate' }),
                expect.objectContaining({ property: 'device' }),
                expect.objectContaining({ property: 'co2' }),
              ]),
            );
          })
      );
    });
  });

  describe('POST /sensor/multi', () => {
    const endpoint = '/iot/sensor/multi';

    const validBody: MultiSensorsDto = {
      date,
      actualDate,
      device,
      temp,
      hum,
      light,
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
      const body: Record<keyof MultiSensorsDto, any> = {
        date: 1,
        actualDate: 'string',
        device: 'string',
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
            expect(res.body.message.length).toEqual(6);
            expect(res.body.message).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ property: 'date' }),
                expect.objectContaining({ property: 'actualDate' }),
                expect.objectContaining({ property: 'device' }),
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
