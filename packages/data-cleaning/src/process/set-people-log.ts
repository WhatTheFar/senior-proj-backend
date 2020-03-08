import { SetPeopleLog, SetPeopleLogModel } from '@senior-proj/log-processing';
import * as mongodb from 'mongodb';

import { IIot, IotModel, IotCollection } from './../model/iot.model';
import { mongooseCursorAsyncGenerator, createSingleProgressBar } from './utils';

export const processSetPeoplelogs = async () => {
  const query = SetPeopleLogModel.find().sort({ date: 1 });
  // .limit(0);
  const count = await query.countDocuments();
  const cursor = query.cursor();

  const progressBar = createSingleProgressBar();
  progressBar.start(count, 0);

  const generator = mongooseCursorAsyncGenerator(cursor);
  for await (const doc of generator) {
    const log: SetPeopleLog = doc.toObject();
    await processEachLog(log);

    await progressBar.increment();
  }
  await progressBar.stop();
};

const processEachLog = async (log: SetPeopleLog) => {
  const initialDate = log.date;
  const finalDate = new Date(initialDate);
  finalDate.setHours(initialDate.getHours() + 1);

  const filter: mongodb.FilterQuery<IIot> = {
    date: { $gt: initialDate, $lte: finalDate },
  };
  const updateResult = await IotCollection.updateMany(filter, {
    $set: { 'flag.afterSetPeople1Hour': null },
  });
};
