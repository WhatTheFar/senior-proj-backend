import * as mongodb from 'mongodb';

import { IIot, IIotDoc, IotModel, IotCollection } from './../model/iot.model';
import {
  createSingleProgressBar,
  iterateMongoQueryWithProgressBar,
} from './utils';

export async function processAtNightFlag() {
  // tslint:disable-next-line: no-console
  console.log('Processing at night flag');

  const progressBar = createSingleProgressBar();
  progressBar.start(1, 0);

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
        into: 'sensors',
        on: '_id',
        whenMatched: 'merge',
        whenNotMatched: 'fail',
      },
    },
  ];
  const cursor = await IotCollection.aggregate(pipeline);
  const results = await cursor.toArray();

  await progressBar.increment();
  await progressBar.stop();
}
