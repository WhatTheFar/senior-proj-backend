import { MicroGearService } from './../microgear/microgear.service';
import { Injectable } from '@nestjs/common';
import { IOT_MODEL, IIot, MultiSensor } from './iot.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/**
 * Constants for NETPIE
 */
const NETPIE_IOT_SYNC_TOPIC = '/iot';

@Injectable()
export class IotService {
  constructor(
    private readonly microgearService: MicroGearService,
    @InjectModel(IOT_MODEL) private readonly iotModel: Model<IIot>,
  ) {}

  publishTimeSyncronization(time: Date) {
    this.microgearService.publish(NETPIE_IOT_SYNC_TOPIC, time.toISOString());
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
