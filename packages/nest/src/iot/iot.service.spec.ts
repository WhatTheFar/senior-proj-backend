// tslint:disable: max-line-length

import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectID } from 'bson';
import { Model } from 'mongoose';
import { ConfigService } from './../config/config.service';
import { MicroGearModule } from './../microgear/microgear.module';
import { IotDto } from './iot.dto';
import { IIotDoc, IOT_MODEL, IotSchema } from './iot.model';
import { IotService } from './iot.service';

const baseIotDoc = {
	__v: expect.any(Number),
	_id: expect.any(ObjectID),
	date: expect.any(Date),
	co2: [],
	multi: []
};

const basePeople = {
	actualDate: expect.any(Date),
	people: expect.any(Number)
};

const baseMulti = {
	_id: expect.any(ObjectID),
	actualDate: expect.any(Date),
	device: expect.any(Number),
	temp: expect.any(Number),
	hum: expect.any(Number),
	light: expect.any(Number)
};

const baseCo2 = {
	_id: expect.any(ObjectID),
	actualDate: expect.any(Date),
	device: expect.any(Number),
	co2: expect.any(Number)
};

describe('IotService', () => {
	let service: IotService;
	let iotModel: Model<IIotDoc>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				MongooseModule.forRootAsync({
					useClass: ConfigService
				}),
				MongooseModule.forFeature([
					{ name: IOT_MODEL, schema: IotSchema, collection: 'sensors' }
				]),
				MicroGearModule
			],
			providers: [IotService]
		}).compile();

		service = module.get<IotService>(IotService);
		iotModel = module.get<Model<IIotDoc>>(getModelToken(IOT_MODEL));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	const date = new Date('2020-01-01T09:00:00.000Z');
	const actualDate = new Date('2020-01-01T09:00:00.000Z');
	const tomorrowDate = new Date('2020-01-02T10:00:00.000Z');
	const actualTomorrowDate = new Date('2020-01-02T10:00:00.000Z');
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
					people: basePeople
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
					light
				}
			];

			it('document should be created in DB', async () => {
				const docs = await iotModel.find({ date });

				expect(docs.length).toEqual(1);
				expect(docs[0].toObject()).toEqual({
					...baseIotDoc,
					date,
					multi: expectedMulti
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
								co2
							}
						],
						multi: expectedMulti
					});
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
					co2
				}
			];

			it('document should be created in DB', async () => {
				const docs = await iotModel.find({ date });

				expect(docs.length).toEqual(1);
				expect(docs[0].toObject()).toEqual({
					...baseIotDoc,
					date,
					co2: expectedCo2
				});
				expect(docs[0].multi.length).toEqual(0);
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
								light
							}
						]
					});
				});
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
						co2: expectedCo2
					});
				});

				describe('When savePeopleNumber called on tomorrow date', () => {
					beforeEach(async () => {
						await service.savePeopleNumber(tomorrowDate, {
							...peoplePayload,
							actualDate: actualTomorrowDate
						});
					});

					describe('saveMultiSensors called with device 3 on the same date, and light = 0', () => {
						beforeEach(async () => {
							await service.saveMultiSensors(date, {
								...multiPayload,
								device: 3,
								light: 0
							});
						});

						describe('When getAllSensorsCSV called with date inclusively', () => {
							let csv: string = '';
							beforeEach(async () => {
								const tomorrowWithExtraMin = new Date(tomorrowDate);
								tomorrowWithExtraMin.setMinutes(
									tomorrowWithExtraMin.getMinutes() + 1
								);

								const generator = service.getAllSensorsCSV({
									start: date,
									end: tomorrowWithExtraMin
								});

								for await (const e of generator) {
									csv += e;
								}
							});

							const expectedCsv = `date,people,co2,hum1,hum2,hum3,hum4,temp1,temp2,temp3,temp4,light1,light2,light3,light4
${tomorrowDate.toISOString()},${people},-,-,-,-,-,-,-,-,-,-,-,-,-
${date.toISOString()},${people},${co2},-,-,${hum},-,-,-,${temp},-,-,-,${0},-`;

							it('Then it should return a csv w/ 1 row', () => {
								expect(csv).toEqual(expectedCsv);
							});
						});

						describe('saveMultiSensors called with device 1, 2, and 4 on the same date', () => {
							beforeEach(async () => {
								await service.saveMultiSensors(date, {
									...multiPayload,
									device: 1
								});
								await service.saveMultiSensors(date, {
									...multiPayload,
									device: 2
								});
								await service.saveMultiSensors(date, {
									...multiPayload,
									device: 4
								});
							});

							describe('When getAllSensorsCSV called with date inclusively', () => {
								let csv: string = '';
								beforeEach(async () => {
									const tomorrowWithExtraMin = new Date(tomorrowDate);
									tomorrowWithExtraMin.setMinutes(
										tomorrowWithExtraMin.getMinutes() + 1
									);

									const generator = service.getAllSensorsCSV({
										start: date,
										end: tomorrowWithExtraMin
									});

									for await (const e of generator) {
										csv += e;
									}
								});

								const expectedCsv = `date,people,co2,hum1,hum2,hum3,hum4,temp1,temp2,temp3,temp4,light1,light2,light3,light4
${tomorrowDate.toISOString()},${people},-,-,-,-,-,-,-,-,-,-,-,-,-
${date.toISOString()},${people},${co2},${hum},${hum},${hum},${hum},${temp},${temp},${temp},${temp},${light},${light},${0},${light}`;

								it('Then it should return a csv w/ 1 row', () => {
									expect(csv).toEqual(expectedCsv);
								});
							});

							describe('When getAllSensorsCSV called with date inclusively and skipping invalid data', () => {
								let csv: string = '';
								beforeEach(async () => {
									const tomorrowWithExtraMin = new Date(tomorrowDate);
									tomorrowWithExtraMin.setMinutes(
										tomorrowWithExtraMin.getMinutes() + 1
									);

									const generator = service.getAllSensorsCSV({
										start: date,
										end: tomorrowWithExtraMin,
										skip: true
									});

									for await (const e of generator) {
										csv += e;
									}
								});

								const expectedCsv = `date,people,co2,hum1,hum2,hum3,hum4,temp1,temp2,temp3,temp4,light1,light2,light3,light4
${date.toISOString()},${people},${co2},${hum},${hum},${hum},${hum},${temp},${temp},${temp},${temp},${light},${light},${0},${light}`;

								it('Then it should return a csv w/ 1 row', () => {
									expect(csv).toEqual(expectedCsv);
								});
							});
						});
					});

					describe('When getAllSensorsByDate called with range from today(inclusive) to tomorrow(exclusive)', () => {
						const allSensors: IotDto[] = [];
						beforeEach(async () => {
							const generator = await service.getAllSensorsByDate({
								start: date,
								end: tomorrowDate
							});
							for await (const e of generator) {
								allSensors.push(e);
							}
						});

						it('Then it should return an array w/ 1 elem', () => {
							expect(allSensors.length).toEqual(1);
							expect(allSensors[0]).toEqual({
								...baseIotDoc,
								date,
								people: { ...basePeople, actualDate },
								co2: expectedCo2
							});
						});
					});

					describe('When getAllSensorsByDate called with range from today(inclusive) to tomorrow(inclusive)', () => {
						const allSensors: IotDto[] = [];
						beforeEach(async () => {
							const tomorrowWithExtraMin = new Date(tomorrowDate);
							tomorrowWithExtraMin.setMinutes(
								tomorrowWithExtraMin.getMinutes() + 1
							);

							const generator = await service.getAllSensorsByDate({
								start: date,
								end: tomorrowWithExtraMin
							});
							for await (const e of generator) {
								allSensors.push(e);
							}
						});

						it('Then it should return an array w/ 2 elem', () => {
							expect(allSensors.length).toEqual(2);
							expect(allSensors[0]).toEqual({
								...baseIotDoc,
								date: tomorrowDate,
								people: { ...basePeople, actualDate: actualTomorrowDate }
								// co2: baseCo2,
							});
							expect(allSensors[1]).toEqual({
								...baseIotDoc,
								date,
								people: { ...basePeople, actualDate },
								co2: expectedCo2
							});
						});
					});
				});

				describe('getAllSensors called', () => {
					let allSensors: IotDto[];
					beforeEach(async () => {
						allSensors = await service.getAllSensors({ offset: 0, limit: 0 });
					});

					it('should return an array w/ 1 elem', () => {
						expect(allSensors.length).toEqual(1);
						expect(allSensors[0]).toEqual({
							...baseIotDoc,
							date,
							people: basePeople,
							co2: expectedCo2
						});
					});
				});
			});
		});
	});
});
