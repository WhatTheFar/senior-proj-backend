import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
import { strEnum } from '../../string-enum';

export const NETPIE_LOG_COLLECTION = 'netpie-logs';

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

export interface NetpieLog {
  date: Date;
  topic: string;
  payload: string;
  type: NetpieLogType;
}

export interface NetpieLogDoc extends mongoose.Document, NetpieLog {}

export const NetpieLogModel = mongoose.model<NetpieLogDoc>(
  NETPIE_LOG_COLLECTION,
  NetpieLogSchema,
);

export const NetpieLogCollection: mongodb.Collection<NetpieLog> =
  NetpieLogModel.collection;
