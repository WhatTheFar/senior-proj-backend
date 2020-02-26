import { NetpieLogType, NetpieLog, NetpieLogModel } from './netpie-log.model';
import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';

export const ResetBgLogSchema = new mongoose.Schema({
  actualDate: { type: Date, required: true },
});

export interface ResetBgLog extends NetpieLog {
  actualDate: Date;
}

export interface ResetBgLogDoc extends mongoose.Document, ResetBgLog {}

export const ResetBgLogModel = NetpieLogModel.discriminator<ResetBgLogDoc>(
  NetpieLogType.RESET_BG,
  ResetBgLogSchema,
);

export const ResetBgLogCollection: mongodb.Collection<ResetBgLog> =
  ResetBgLogModel.collection;
