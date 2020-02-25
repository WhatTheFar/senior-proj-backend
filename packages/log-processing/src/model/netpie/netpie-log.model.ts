import * as mongoose from 'mongoose';
import { strEnum } from '../../string-enum';

export const NETPIE_LOG_COLLECTION = 'netpie-log';

/** Create a K:V */
export const NetpieLogType = strEnum(['RESET_BG', 'SET_PEOPLE']);
/** Create a Type */
export type NetpieLogType = keyof typeof NetpieLogType;

const NetpieLogSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    topic: {
      type: String,
      required: true,
    },
    payload: {
      type: String,
      required: true,
    },
  },
  { discriminatorKey: 'type' },
);

export interface NetpieLog extends mongoose.Document {
  date: Date;
  topic: string;
  payload: string;
  type: NetpieLogType;
}

export const NetpieLogModel = mongoose.model<NetpieLog>(
  NETPIE_LOG_COLLECTION,
  NetpieLogSchema,
);
