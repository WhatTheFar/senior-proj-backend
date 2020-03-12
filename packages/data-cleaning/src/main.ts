// tslint:disable: no-console
import * as dotenv from 'dotenv';
import * as yargs from 'yargs';

import { connectMongo, disconnectMongo, withMongo } from './db';
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
import { processAtNightFlag, resetAtNightFlag } from './process/at-night';
import { resetAllFlag } from './process/general';

dotenv.config();

// tslint:disable: no-shadowed-variable
// tslint:disable: no-empty
const argv = yargs
  .command(
    'reset-all',
    'Reset all flags',
    yargs => {},
    async argv => {
      await withMongo(async () => {
        await resetAllFlag();
      });
    },
  )
  .command('process [name]', 'Process data cleaning', yargs => {
    yargs
      .option('reset', {
        describe: 'Reset the flag before process',
        boolean: true,
      })
      .command(
        'at-night',
        'At night flag',
        yargs => {},
        async argv => {
          await withMongo(async () => {
            if (argv.reset) {
              await resetAtNightFlag();
            }
            await processAtNightFlag();
          });
        },
      )
      .command(
        'negative',
        'Negative flag',
        yargs => {},
        async argv => {
          await withMongo(async () => {
            if (argv.reset) {
              await resetAllNegativeCountFlag();
            }
            await processNegativeWithin1HourFlag();
            await processNegativeBeforeSetPeopleFlag();
            await processNegativeFlag();
          });
        },
      )
      .command(
        'set-people',
        'Set people flag',
        yargs => {},
        async argv => {
          await withMongo(async () => {
            if (argv.reset) {
              await resetAllSetPeopleFlag();
            }
            await processSetPeoplelogs();
          });
        },
      )
      .demandCommand();
  })
  .demandCommand()
  .version(false)
  .help().argv;
