import { NetpieLogType, NetpieLog, NetpieLogModel } from './netpie-log.model';
import * as mongoose from 'mongoose';

export const ResetBgLogSchema = new mongoose.Schema({
  actualDate: { type: Date, required: true },
});

export interface ResetBgLog extends NetpieLog {
  actualDate: Date;
}

export const ResetBgLogModel = NetpieLogModel.discriminator<ResetBgLog>(
  NetpieLogType.RESET_BG,
  ResetBgLogSchema,
);
