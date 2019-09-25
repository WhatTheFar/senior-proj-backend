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

  async saveCO2(date: Date, co2: number) {
    const doc = await this.iotModel.findOne({
      date,
    });
    if (doc) {
      doc.co2 = co2;
      await doc.save();
    } else {
      const newDoc = new this.iotModel({ date, co2 });
      await newDoc.save();
    }
  }

  async saveMultiSensors(date: Date, multi: MultiSensor) {
    const doc = await this.iotModel.findOne({
      date,
    });
    if (doc) {
      doc.multi.push(multi);
      await doc.save();
    } else {
      const newDoc = new this.iotModel({ date, multi: [multi] });
      await newDoc.save();
    }
  }
}
