import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MicroGearService } from './../microgear/microgear.service';
import { IotDto } from './iot.dto';
import { IIotDoc, IOT_MODEL, MultiSensor } from './iot.model';

/**
 * Constants for NETPIE
 */
const NETPIE_IOT_SYNC_TOPIC = '/iot';
const NETPIE_COUNTER_BG_RESET_TOPIC = '/people/bg';
const NETPIE_PEOPLE_COUNT_SET_TOPIC = '/people/set';

@Injectable()
export class IotService {
	constructor(
		private readonly microgearService: MicroGearService,
		@InjectModel(IOT_MODEL) private readonly iotModel: Model<IIotDoc>
	) {}

	public publishTimeSyncronization(time: Date) {
		this.microgearService.publish(NETPIE_IOT_SYNC_TOPIC, time.toISOString());
	}

	public resetCounterBackground() {
		this.microgearService.publish(
			NETPIE_COUNTER_BG_RESET_TOPIC,
			new Date().toISOString()
		);
	}

	public setPeopleCount(count: number) {
		this.microgearService.publish(NETPIE_PEOPLE_COUNT_SET_TOPIC, count.toString());
	}

	public async getAllSensors(options?: {
		offset?: number;
		limit?: number;
	}): Promise<IotDto[]> {
		const { offset, limit } = {
			offset: 0,
			limit: 0,
			...options
		};

		const query = await this.iotModel
			.find()
			.sort({ date: -1 })
			.skip(offset)
			.limit(limit)
			.exec();

		return query.map(o => o.toObject());
	}

	public async *getAllSensorsByDate(options?: {
		start?: Date;
		end?: Date;
	}): AsyncGenerator<IotDto> {
		const { start, end } = options;

		const dateMatch = {} as any;
		if (start != null) {
			dateMatch.$gte = start;
		}
		if (end != null) {
			dateMatch.$lt = end;
		}

		const cursor = this.iotModel
			.find({ date: dateMatch })
			.sort({ date: -1 })
			.cursor();

		for await (const doc of cursor) {
			yield (doc as IIotDoc).toObject();
		}
	}

	public async *getAllSensorsCSV(options?: {
		start?: Date;
		end?: Date;
		skip?: boolean;
	}): AsyncGenerator<string> {
		const { start, end, skip } = { skip: false, ...options };

		const sensors = this.getAllSensorsByDate({ start, end });
		let csvString =
			'date,people,co2,hum1,hum2,hum3,hum4,temp1,temp2,temp3,temp4,light1,light2,light3,light4';
		yield csvString;

		for await (const row of sensors) {
			if (
				skip &&
				(row.multi.length !== 4 || row.co2.length !== 1 || row.people == null)
			) {
				continue;
			}
			csvString = `\n${row.date.toISOString()}`;
			csvString += `,${row.people ? row.people.people : '-'}`;
			csvString += `,${row.co2[0] ? row.co2[0].co2 : '-'}`;

			const sortedMulti =
				row.multi != null
					? row.multi.sort((l, r) => {
							return l.device - r.device;
					  })
					: [];

			let humString = '';
			let tempString = '';
			let lightString = '';

			// tslint:disable-next-line: prefer-for-of
			for (let i = 0, device = 1; device <= 4; device++) {
				const multi = sortedMulti[i];

				if (device > 1) {
					humString += ',';
					tempString += ',';
					lightString += ',';
				}
				if (multi == null || device < multi.device) {
					humString += '-';
					tempString += '-';
					lightString += '-';
				} else {
					humString += multi.hum;
					tempString += multi.temp;
					lightString += multi.light;
					i++;
				}
			}

			csvString += `,${humString},${tempString},${lightString}`;
			yield csvString;
		}
	}

	public async savePeopleNumber(
		date: Date,
		payload: { actualDate: Date; people: number }
	) {
		const doc = await this.iotModel.findOne({
			date
		});
		if (doc) {
			doc.people = payload;
			await doc.save();
		} else {
			const newDoc = new this.iotModel({ date, people: payload });
			await newDoc.save();
		}
	}

	public async saveCO2(
		date: Date,
		payload: { actualDate: Date; device: number; co2: number }
	) {
		const doc = await this.iotModel.findOne({
			date
		});
		if (doc) {
			doc.co2.push(payload);
			await doc.save();
		} else {
			const newDoc = new this.iotModel({ date, co2: [payload] });
			await newDoc.save();
		}
	}

	public async saveMultiSensors(date: Date, payload: MultiSensor) {
		const doc = await this.iotModel.findOne({
			date
		});
		if (doc) {
			doc.multi.push(payload);
			await doc.save();
		} else {
			const newDoc = new this.iotModel({ date, multi: [payload] });
			await newDoc.save();
		}
	}
}
