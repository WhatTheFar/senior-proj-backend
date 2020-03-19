import { SetPeopleLog, SetPeopleLogModel } from '@senior-proj/log-processing';
import * as mongodb from 'mongodb';

import { IIot, IIotDoc, IotModel, IotCollection } from './../model/iot.model';
import {
  createSingleProgressBar,
  iterateMongoQueryWithProgressBar,
} from '../utils';

const MILLISECONDS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
};

export async function processNegativeWithin1HourFlag() {
  // tslint:disable-next-line: no-console
  console.log('Processing negative people count [within 1 hour flag]');

  const queryFilter: mongodb.FilterQuery<IIot> = {
    'people.people': { $lt: 0 },
  };
  const query = IotModel.find(queryFilter).sort({ date: 1 });

  let lastProcessedDate: Date | null = null;
  await iterateMongoQueryWithProgressBar(query, async (doc: IIotDoc) => {
    const iot: IIot = doc.toObject();
    if (
      lastProcessedDate == null ||
      iot.date.getTime() - lastProcessedDate.getTime() > MILLISECONDS.HOUR
    ) {
      await setWithin1HourFlag(iot.date);
      lastProcessedDate = iot.date;
    }
  });
}

async function setWithin1HourFlag(date: Date) {
  const initialDate = date;
  const finalDate = new Date(initialDate);
  finalDate.setHours(initialDate.getHours() + 1);

  const updateFilter: mongodb.FilterQuery<IIot> = {
    date: { $gte: initialDate, $lte: finalDate },
  };
  const updateResult = await IotCollection.updateMany(updateFilter, {
    $set: { 'flag.aftNegCntW/n1H': true },
  });
}

export async function processNegativeBeforeSetPeopleFlag() {
  // tslint:disable-next-line: no-console
  console.log('Processing negative people count [before set people flag]');

  const queryFilter: mongodb.FilterQuery<IIot> = {
    'people.people': { $lt: 0 },
  };
  const query = IotModel.find(queryFilter).sort({ date: 1 });

  let lastProcessedDate: Date | null = null;
  await iterateMongoQueryWithProgressBar(query, async (doc: IIotDoc) => {
    const iot: IIot = doc.toObject();
    if (lastProcessedDate == null || iot.date > lastProcessedDate) {
      const latestModifiedDate = await setBeforeSetPeopleFlag(iot.date);
      if (latestModifiedDate == null) {
        throw new Error('`latestModifiedDate` should not be null');
      }
      lastProcessedDate = latestModifiedDate;
    }
  });
}

/**
 * Set the 'aftNegCntBfrSetPpl' flag
 * @param {Date} date
 * @returns {Promise} Promise object represents the latest date modified(exclusively)
 */
async function setBeforeSetPeopleFlag(date: Date): Promise<Date | null> {
  const queryFilter: mongodb.FilterQuery<SetPeopleLog> = {
    date: { $gte: date },
  };
  const log = await SetPeopleLogModel.findOne(queryFilter).sort({ date: 1 });

  const initialDate = date;

  if (log != null) {
    const finalDate = log.date;
    const filter: mongodb.FilterQuery<IIot> = {
      date: { $gte: initialDate, $lt: finalDate },
    };
    const updateResult = await IotCollection.updateMany(filter, {
      $set: { 'flag.aftNegCntBfrSetPpl': true },
    });
    return finalDate;
  } else {
    const filter: mongodb.FilterQuery<IIot> = {
      date: { $gte: initialDate },
    };
    const updateResult = await IotCollection.updateMany(filter, {
      $set: { 'flag.aftNegCntBfrSetPpl': true },
    });
    return null;
  }
}

async function setUntilPositiveFlag(date: Date): Promise<Date | null> {
  const initialDate = date;
  const filter: mongodb.FilterQuery<IIot> = {
    // tslint:disable-next-line: object-literal-key-quotes
    date: { $gte: initialDate },
    'people.people': { $lt: 0 },
  };
  const updateResult = await IotCollection.updateMany(filter, {
    $set: { 'flag.aftNegCntTilPos': true },
  });

  const findOneFilter: mongodb.FilterQuery<IIot> = {
    // tslint:disable-next-line: object-literal-key-quotes
    date: { $gte: initialDate },
    'people.people': { $lt: 0 },
  };
  const doc = await IotModel.findOne(findOneFilter).sort({ date: 1 });
  if (doc == null) {
    return null;
  }
  return doc.date;
}

export async function processNegativeFlag() {
  // tslint:disable-next-line: no-console
  console.log('Processing negative people count [negative flag]');

  const progressBar = createSingleProgressBar();
  progressBar.start(1, 0);

  const filter: mongodb.FilterQuery<IIot> = {
    'people.people': { $lt: 0 },
  };
  const updateResult = await IotCollection.updateMany(filter, {
    $set: { 'flag.neg': true },
  });

  await progressBar.increment();
  await progressBar.stop();
}

export async function resetAllNegativeCountFlag() {
  // tslint:disable-next-line: no-console
  console.log('Unsetting all negative people flag');

  const updateResult = await IotCollection.updateMany(
    {},
    {
      $unset: {
        'flag.aftNegCntW/n1H': '',
        'flag.aftNegCntBfrSetPpl': '',
        // Deprecated flag of 'flag.neg'
        'flag.aftNegCntTilPos': '',
        'flag.neg': '',
      },
    },
  );
}
