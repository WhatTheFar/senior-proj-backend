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
import { generateCSV } from './csv';

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
  .command('gen [name]', 'Genrate data', yargs => {
    yargs
      .command(
        'csv',
        'CSV file',
        yargs => {
          return yargs
            .option('start', {
              alias: 'start-date',
              describe: 'Set start date',
              string: true,
            })
            .option('end', {
              alias: 'end-date',
              describe: 'Set end date (exclusive)',
              string: true,
            });
        },
        async argv => {
          let start: Date | undefined;
          let end: Date | undefined;
          if (argv.start != null) {
            start = parseDateOrUndefined(argv.start);
            if (start == null) {
              throw new Error('Invalid date string in --start');
            }
          }
          if (argv.end != null) {
            end = parseDateOrUndefined(argv.end);
            if (end == null) {
              throw new Error('Invalid date string in --end');
            }
          }
          await withMongo(async () => {
            await generateCSV({ start, end });
          });
        },
      )
      .demandCommand();
  })
  .demandCommand()
  .version(false)
  .help().argv;

function isDate(d: unknown): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}

function parseDateOrUndefined(dateString: string): Date | undefined {
  // if (dateString == null) {
  //   return undefined;
  // }
  const date = new Date(dateString);
  return isDate(date) ? date : undefined;
}
