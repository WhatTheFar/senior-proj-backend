import { IIot } from './../../dist/iot/iot.model.d';
import { ConfigService } from './../config/config.service';
import { IOT_MODEL, IotSchema } from './iot.model';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MicroGearModule } from './../microgear/microgear.module';
import { Test, TestingModule } from '@nestjs/testing';
import { IotService } from './iot.service';
import { Model } from 'mongoose';
import { ObjectID } from 'bson';

describe('IotService', () => {
  let service: IotService;
  let iotModel: Model<IIot>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useClass: ConfigService,
        }),
        MongooseModule.forFeature([
          { name: IOT_MODEL, schema: IotSchema, collection: 'sensors' },
        ]),
        MicroGearModule,
      ],
      providers: [IotService],
    }).compile();

    service = module.get<IotService>(IotService);
    iotModel = module.get<Model<IIot>>(getModelToken(IOT_MODEL));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveCO2', () => {
    describe('Given an empty DB', () => {
      beforeEach(async () => {
        await iotModel.deleteMany({});
      });

      describe('saveCO2 called', () => {
        const date = new Date();
        const co2 = 123.456;
        beforeEach(async () => {
          await service.saveCO2(date, co2);
        });

        it('document should be created in DB', async () => {
          const docs = await iotModel.find({ date });

          expect(docs.length).toEqual(1);
          expect(docs[0].toObject()).toEqual({
            __v: expect.any(Number),
            _id: expect.any(ObjectID),
            date,
            co2,
            multi: [],
          });
          expect(docs[0].multi.length).toEqual(0);
        });
      });
    });

    describe('Given multi sensors has been saved', () => {
      const date = new Date();
      const co2 = 123.456;

      const device = 1;
      const temp = 42.5;
      const hum = 42.5;
      const light = 100.2;
      beforeEach(async () => {
        await iotModel.deleteMany({});
        await service.saveMultiSensors(date, { device, temp, hum, light });
      });

      describe('saveCO2 called on the same date', () => {
        beforeEach(async () => {
          await service.saveCO2(date, co2);
        });

        it('document should be modified', async () => {
          const docs = await iotModel.find({ date });

          expect(docs.length).toEqual(1);
          expect(docs[0].toObject()).toEqual({
            __v: expect.any(Number),
            _id: expect.any(ObjectID),
            date,
            co2,
            multi: [
              {
                _id: expect.any(ObjectID),
                device,
                temp,
                hum,
                light,
              },
            ],
          });
        });
      });
    });
  });

  describe('saveMultiSensors', () => {
    describe('Given an empty DB', () => {
      beforeEach(async () => {
        await iotModel.deleteMany({});
      });

      describe('saveMultiSensors called', () => {
        const date = new Date();
        const device = 1;
        const temp = 42.5;
        const hum = 42.5;
        const light = 100.2;
        beforeEach(async () => {
          await service.saveMultiSensors(date, { device, temp, hum, light });
        });

        it('document should be created in DB', async () => {
          const docs = await iotModel.find({ date });

          expect(docs.length).toEqual(1);
          expect(docs[0].toObject()).toEqual({
            __v: expect.any(Number),
            _id: expect.any(ObjectID),
            date,
            multi: [
              {
                _id: expect.any(ObjectID),
                device,
                temp,
                hum,
                light,
              },
            ],
          });
          expect(docs[0].multi.length).toEqual(1);
        });
      });
    });

    describe('Given co2 sensors has been saved', () => {
      const date = new Date();
      const co2 = 123.456;

      const device = 1;
      const temp = 42.5;
      const hum = 42.5;
      const light = 100.2;
      beforeEach(async () => {
        await iotModel.deleteMany({});
        await service.saveCO2(date, co2);
      });

      describe('saveCO2 called on the same date', () => {
        beforeEach(async () => {
          await service.saveMultiSensors(date, { device, temp, hum, light });
        });

        it('document should be modified', async () => {
          const docs = await iotModel.find({ date });

          expect(docs.length).toEqual(1);
          expect(docs[0].toObject()).toEqual({
            __v: expect.any(Number),
            _id: expect.any(ObjectID),
            date,
            co2,
            multi: [
              {
                _id: expect.any(ObjectID),
                device,
                temp,
                hum,
                light,
              },
            ],
          });
        });
      });
    });
  });
});
