// tslint:disable: no-console
import * as dotenv from 'dotenv';

import { connectMongo, disconnectMongo } from './db';
import { processSetPeoplelogs } from './process/set-people-log';
import {
  processNegativeWithin1HourFlag,
  processNegativeBeforeSetPeopleFlag,
  processNegativeFlag,
  resetAllNegativeCountFlag,
} from './process/negative-count';

const main = async () => {
  dotenv.config();

  console.log();
  console.log('Connecting Mongo...');
  await connectMongo();
  console.log('Connected to Mongo');
  console.log();

  await processSetPeoplelogs();
  console.log();

  await resetAllNegativeCountFlag();
  await processNegativeWithin1HourFlag();
  await processNegativeBeforeSetPeopleFlag();
  await processNegativeFlag();

  console.log();
  console.log('Disconnecting Mongo...');
  await disconnectMongo();
  console.log('Disconnected to Mongo');
  console.log();
};

main();
