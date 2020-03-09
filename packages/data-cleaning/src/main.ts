// tslint:disable: no-console
import * as dotenv from 'dotenv';

import { connectMongo, disconnectMongo } from './db';
import {
  processSetPeoplelogs,
  resetAllSetPeopleFlag,
} from './process/set-people-log';
import {
  processNegativeWithin1HourFlag,
  processNegativeBeforeSetPeopleFlag,
  processNegativeFlag,
  resetAllNegativeCountFlag,
} from './process/negative-count';
import { processAtNightFlag } from './process/at-night';

const main = async () => {
  dotenv.config();

  console.log();
  console.log('Connecting Mongo...');
  await connectMongo();
  console.log('Connected to Mongo');
  console.log();

  await resetAllSetPeopleFlag();
  await processSetPeoplelogs();
  console.log();

  await resetAllNegativeCountFlag();
  await processNegativeWithin1HourFlag();
  await processNegativeBeforeSetPeopleFlag();
  await processNegativeFlag();
  console.log();

  await processAtNightFlag();
  console.log();

  console.log();
  console.log('Disconnecting Mongo...');
  await disconnectMongo();
  console.log('Disconnected to Mongo');
  console.log();
};

main();
