import { IIot } from './../../dist/iot/iot.model.d';
import { ConfigService } from './../config/config.service';
import { IOT_MODEL, IotSchema } from './iot.model';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MicroGearModule } from './../microgear/microgear.module';
import { Test, TestingModule } from '@nestjs/testing';
import { IotService } from './iot.service';
import { Model } from 'mongoose';
import { ObjectID } from 'bson';
import { async } from 'rxjs/internal/scheduler/async';

const baseIotDoc = {
  __v: expect.any(Number),
  _id: expect.any(ObjectID),
  date: expect.any(Date),
  co2: [],
  multi: [],
};

const basePeople = {
  actualDate: expect.any(Date),
  people: expect.any(Number),
};

const baseMulti = {
  _id: expect.any(ObjectID),
  actualDate: expect.any(Date),
  device: expect.any(Number),
  temp: expect.any(Number),
  hum: expect.any(Number),
  light: expect.any(Number),
};

const baseCo2 = {
  _id: expect.any(ObjectID),
  actualDate: expect.any(Date),
  device: expect.any(Number),
  co2: expect.any(Number),
};

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

  const date = new Date();
  const actualDate = new Date();
  const device = 1;

  const people = 1;

  const co2 = 123.456;

  const temp = 42.5;
  const hum = 42.5;
  const light = 100.2;

  const peoplePayload = { actualDate, people };
  const co2Payload = { actualDate, device, co2 };
  const multiPayload = { actualDate, device, temp, hum, light };

  describe('Given an empty DB', () => {
    beforeEach(async () => {
      await iotModel.deleteMany({});
    });

    describe('savePeopleNumber called', () => {
      beforeEach(async () => {
        await service.savePeopleNumber(date, peoplePayload);
      });

      it('document should be created in DB', async () => {
        const docs = await iotModel.find({ date });

        expect(docs.length).toEqual(1);
        expect(docs[0].toObject()).toEqual({
          ...baseIotDoc,
          date,
          people: basePeople,
        });
      });
    });

    describe('saveCO2 called', () => {
      beforeEach(async () => {
        await service.saveCO2(date, co2Payload);
      });

      const expectedCo2 = [
        {
          _id: expect.any(ObjectID),
          actualDate,
          device,
          co2,
        },
      ];

      it('document should be created in DB', async () => {
        const docs = await iotModel.find({ date });

        expect(docs.length).toEqual(1);
        expect(docs[0].toObject()).toEqual({
          ...baseIotDoc,
          date,
          co2: expectedCo2,
        });
        expect(docs[0].multi.length).toEqual(0);
      });

      describe('savePeopleNumber called on the same date', () => {
        beforeEach(async () => {
          await service.savePeopleNumber(date, peoplePayload);
        });

        it('document should be created in DB', async () => {
          const docs = await iotModel.find({ date });

          expect(docs.length).toEqual(1);
          expect(docs[0].toObject()).toEqual({
            ...baseIotDoc,
            date,
            people: basePeople,
            co2: expectedCo2,
          });
        });

        describe('getAllSensors called', () => {
          let allSensors: IIot[];
          beforeEach(async () => {
            allSensors = await service.getAllSensors({ offset: 0, limit: 0 });
          });

          it('should return an array w/ 1 elem', () => {
            expect(allSensors.length).toEqual(1);
            expect(allSensors[0]).toEqual({
              ...baseIotDoc,
              date,
              people: basePeople,
              co2: expectedCo2,
            });
          });
        });
      });

      describe('saveMultiSensors called on the same date', () => {
        beforeEach(async () => {
          await service.saveMultiSensors(date, multiPayload);
        });

        it('document should be modified with addtional MultiSensors', async () => {
          const docs = await iotModel.find({ date });

          expect(docs.length).toEqual(1);
          expect(docs[0].toObject()).toEqual({
            ...baseIotDoc,
            date,
            co2: expectedCo2,
            multi: [
              {
                ...baseMulti,
                actualDate,
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

    describe('saveMultiSensors called', () => {
      beforeEach(async () => {
        await service.saveMultiSensors(date, multiPayload);
      });
      const expectedMulti = [
        {
          ...baseMulti,
          actualDate,
          device,
          temp,
          hum,
          light,
        },
      ];

      it('document should be created in DB', async () => {
        const docs = await iotModel.find({ date });

        expect(docs.length).toEqual(1);
        expect(docs[0].toObject()).toEqual({
          ...baseIotDoc,
          date,
          multi: expectedMulti,
        });
        expect(docs[0].multi.length).toEqual(1);
      });

      describe('saveCO2 called on the same date', () => {
        beforeEach(async () => {
          await service.saveCO2(date, co2Payload);
        });

        it('document should be modified, with addtional CO2', async () => {
          const docs = await iotModel.find({ date });

          expect(docs.length).toEqual(1);
          expect(docs[0].toObject()).toEqual({
            ...baseIotDoc,
            date,
            co2: [
              {
                ...baseCo2,
                actualDate,
                device,
                co2,
              },
            ],
            multi: expectedMulti,
          });
        });
      });
    });
  });
});
