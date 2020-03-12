import * as mongodb from 'mongodb';
import * as mongoose from 'mongoose';

import {
  IOT_COLLECTION,
  IIot,
  IIotDoc,
  IotModel,
  IotCollection,
} from './../model/iot.model';
import {
  createSingleProgressBar,
  iterateMongoQueryWithProgressBar,
  executeWithOneStepProgressBar,
  mongooseCursorAsyncGenerator,
} from './utils';

export async function processAtNightFlag() {
  // tslint:disable-next-line: no-console
  console.log('Processing at night flag');

  await executeWithOneStepProgressBar(async () => {
    const tempCollection = 'sensors2';
    const outResults = await IotCollection.aggregate([
      { $out: tempCollection },
    ]).toArray();

    const pipeline = [
      {
        $addFields: {
          hour: { $hour: '$date' },
        },
      },
      {
        $match: {
          $or: [
            {
              hour: { $gte: 19 },
            },
            {
              hour: { $lt: 7 },
            },
          ],
        },
      },
      {
        $addFields: {
          'flag.atNight': true,
        },
      },
      {
        $project: {
          flag: 1,
        },
      },
      {
        $merge: {
          into: IOT_COLLECTION,
          on: '_id',
          whenMatched: 'merge',
          whenNotMatched: 'fail',
        },
      },
    ];
    const cursor = await mongoose.connection
      .collection(tempCollection)
      .aggregate(pipeline);
    const results = await cursor.toArray();
  });
}

export async function resetAtNightFlag() {
  // tslint:disable-next-line: no-console
  console.log('Unsetting at night flag');

  await executeWithOneStepProgressBar(async () => {
    const updateResult = await IotCollection.updateMany(
      {},
      {
        $unset: {
          'flag.atNight': '',
        },
      },
    );
  });
}
