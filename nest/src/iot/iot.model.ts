import * as mongoose from 'mongoose';

export const IOT_MODEL = 'iot';

export const IotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  co2: Number,
  multi: [
    {
      device: { type: Number, required: true },
      temp: { type: Number, required: true },
      hum: { type: Number, required: true },
      light: { type: Number, required: true },
    },
  ],
});

export interface MultiSensor {
  device: number;
  temp: number;
  hum: number;
  light: number;
}

export interface IIot extends mongoose.Document {
  date: Date;
  co2?: number;
  multi: MultiSensor[];
}
