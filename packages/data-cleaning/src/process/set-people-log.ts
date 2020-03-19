import {
  SetPeopleLog,
  SetPeopleLogDoc,
  SetPeopleLogModel,
} from '@senior-proj/log-processing';
import * as mongodb from 'mongodb';

import { IIot, IotCollection } from './../model/iot.model';
import { iterateMongoQueryWithProgressBar } from '../utils';

export const processSetPeoplelogs = async () => {
  const query = SetPeopleLogModel.find().sort({ date: 1 });
  // .limit(0);
  const count = await query.countDocuments();

  await iterateMongoQueryWithProgressBar(
    query,
    async (doc: SetPeopleLogDoc) => {
      const log: SetPeopleLog = doc.toObject();
      await processEachLog(log);
    },
  );
};

const processEachLog = async (log: SetPeopleLog) => {
  const initialDate = log.date;
  const finalDate = new Date(initialDate);
  finalDate.setHours(initialDate.getHours() + 1);

  const filter: mongodb.FilterQuery<IIot> = {
    date: { $gt: initialDate, $lte: finalDate },
  };
  const updateResult = await IotCollection.updateMany(filter, {
    $set: { 'flag.aftSetPplW/n1H': true },
  });
};

export async function resetAllSetPeopleFlag() {
  // tslint:disable-next-line: no-console
  console.log('Unsetting all set people flag');

  const updateResult = await IotCollection.updateMany(
    {},
    {
      $unset: {
        // Deprecated flag of 'flag.aftSetPplW/n1H'
        'flag.afterSetPeople1Hour': '',
        'flag.aftSetPplW/n1H': '',
      },
    },
  );
}
