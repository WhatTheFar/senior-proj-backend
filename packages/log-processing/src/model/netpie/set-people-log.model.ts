import { NetpieLogType, NetpieLog, NetpieLogModel } from './netpie-log.model';
import * as mongoose from 'mongoose';

export const SetPeopleLogSchema = new mongoose.Schema({
  people: { type: Number, required: true },
});

export interface SetPeopleLog extends NetpieLog {
  people: number;
}

export const SetPeopleLogModel = NetpieLogModel.discriminator<SetPeopleLog>(
  NetpieLogType.SET_PEOPLE,
  SetPeopleLogSchema,
);
