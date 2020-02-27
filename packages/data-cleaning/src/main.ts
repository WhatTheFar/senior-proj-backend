// tslint:disable: no-console
import * as dotenv from 'dotenv';

import { connectMongo, disconnectMongo } from './db';
import { processSetPeoplelogs } from './process/set-people-log';

const main = async () => {
  dotenv.config();

  console.log();
  console.log('Connecting Mongo...');
  await connectMongo();
  console.log('Connected to Mongo');
  console.log();

  await processSetPeoplelogs();

  console.log();
  console.log('Disconnecting Mongo...');
  await disconnectMongo();
  console.log('Disconnected to Mongo');
  console.log();
};

main();
