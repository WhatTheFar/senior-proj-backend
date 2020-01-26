import { IotDto } from './iot.dto';
import { MicroGearService } from './../microgear/microgear.service';
import { Injectable } from '@nestjs/common';
import { IOT_MODEL, IIot, MultiSensor } from './iot.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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
    @InjectModel(IOT_MODEL) private readonly iotModel: Model<IIot>,
  ) {}

  publishTimeSyncronization(time: Date) {
    this.microgearService.publish(NETPIE_IOT_SYNC_TOPIC, time.toISOString());
  }

  resetCounterBackground() {
    this.microgearService.publish(
      NETPIE_COUNTER_BG_RESET_TOPIC,
      new Date().toISOString(),
    );
  }

  setPeopleCount(count: number) {
    this.microgearService.publish(
      NETPIE_PEOPLE_COUNT_SET_TOPIC,
      count.toString(),
    );
  }

  async getAllSensors(options?: {
    offset?: number;
    limit?: number;
  }): Promise<IotDto[]> {
    const { offset, limit } = {
      offset: 0,
      limit: 0,
      ...options,
    };

    const query = await this.iotModel
      .find()
      .sort({ date: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    return query.map(o => o.toObject());
  }

  async getAllSensorsByDate(options?: {
    start?: Date;
    end?: Date;
  }): Promise<IotDto[]> {
    const { start, end } = options;

    const dateMatch = {} as any;
    if (start != null) {
      dateMatch.$gte = start;
    }
    if (end != null) {
      dateMatch.$lt = end;
    }

    const query = await this.iotModel
      .find({ date: dateMatch })
      .sort({ date: -1 })
      .exec();

    return query.map(o => o.toObject());
  }

  async getAllSensorsCSV(options?: {
    start?: Date;
    end?: Date;
  }): Promise<string> {
    const { start, end } = options;

    const sensors = await this.getAllSensorsByDate({ start, end });
    let csvString =
      'date,people,co2,hum1,hum2,hum3,hum4,temp1,temp2,temp3,temp4,light1,light2,light3,light4';

    sensors.forEach(row => {
      csvString += `
${row.date.toISOString()}`;
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
          humString += multi.hum || '-';
          tempString += multi.temp || '-';
          lightString += multi.light || '-';
          i++;
        }
      }

      csvString += `,${humString},${tempString},${lightString}`;
    });

    return csvString;
  }

  async savePeopleNumber(
    date: Date,
    payload: { actualDate: Date; people: number },
  ) {
    const doc = await this.iotModel.findOne({
      date,
    });
    if (doc) {
      doc.people = payload;
      await doc.save();
    } else {
      const newDoc = new this.iotModel({ date, people: payload });
      await newDoc.save();
    }
  }

  async saveCO2(
    date: Date,
    payload: { actualDate: Date; device: number; co2: number },
  ) {
    const doc = await this.iotModel.findOne({
      date,
    });
    if (doc) {
      doc.co2.push(payload);
      await doc.save();
    } else {
      const newDoc = new this.iotModel({ date, co2: [payload] });
      await newDoc.save();
    }
  }

  async saveMultiSensors(date: Date, payload: MultiSensor) {
    const doc = await this.iotModel.findOne({
      date,
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
