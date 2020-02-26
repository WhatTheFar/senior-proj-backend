import { NetpieLogType, NetpieLog, NetpieLogModel } from './netpie-log.model';
import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';

export const SetPeopleLogSchema = new mongoose.Schema({
  people: { type: Number, required: true },
});

export interface SetPeopleLog extends NetpieLog {
  people: number;
}

export interface SetPeopleLogDoc extends mongoose.Document, SetPeopleLog {}

export const SetPeopleLogModel = NetpieLogModel.discriminator<SetPeopleLogDoc>(
  NetpieLogType.SET_PEOPLE,
  SetPeopleLogSchema,
);

export const SetPeopleLogCollection: mongodb.Collection<SetPeopleLog> =
  SetPeopleLogModel.collection;
