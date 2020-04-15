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

const HOUR_FLAG_MAP: { [flag: string]: number } = {
  'flag.aftSetPplW/n1H': 1,
  'flag.aftSetPplW/n2H': 2,
};

const processEachLog = async (log: SetPeopleLog) => {
  const initialDate = log.date;
  for (const flag in HOUR_FLAG_MAP) {
    if (HOUR_FLAG_MAP.hasOwnProperty(flag)) {
      const hour = HOUR_FLAG_MAP[flag];

      const finalDate = new Date(initialDate);
      finalDate.setHours(initialDate.getHours() + hour);

      const filter: mongodb.FilterQuery<IIot> = {
        date: { $gt: initialDate, $lte: finalDate },
      };
      const updateResult = await IotCollection.updateMany(filter, {
        $set: { [flag]: true },
      });
    }
  }
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
        'flag.aftSetPplW/n2H': '',
      },
    },
  );
}
