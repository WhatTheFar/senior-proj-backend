import * as backend from '@senior-proj/backend';
import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';

export { IOT_COLLECTION } from '@senior-proj/backend';

const IotSchema = backend.IotSchema.clone();
IotSchema.add({
  flag: {
    type: {
      afterSetPeople1Hour: {
        type: Boolean,
        required: false,
      },
    },
    required: true,
  },
});

export interface IIot extends backend.IIot {
  flag: {
    afterSetPeople1Hour?: boolean;
  };
}

export interface IIotDoc extends mongoose.Document, IIot {}

export const IotModel = mongoose.model<IIotDoc>(
  backend.IOT_COLLECTION,
  IotSchema,
);

export const IotCollection: mongodb.Collection<IIot> = IotModel.collection;
