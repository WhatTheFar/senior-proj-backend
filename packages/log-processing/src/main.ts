// tslint:disable: no-console
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as readline from 'readline';
import * as glob from 'glob';
import * as cliProgress from 'cli-progress';
import * as yargs from 'yargs';

import { connectMongo, disconnectMongo } from './db';
import { parseLog } from './parser';

const argv = yargs
  .option('dry-run', {
    describe: 'Tell the script to not actually process the data',
    boolean: true,
  })
  .help('help').argv;

function skipIfDryRun<T extends CallableFunction>(fn: T, log?: boolean): T {
  const newFn: any = (...args: any[]) => {
    if (log) {
      console.log(
        `=> skipped '${fn.name || '{anonymous}'}' function ${
          args.length !== 0 ? `with ${args}` : ''
        }`,
      );
    }
    if (!argv['dry-run']) {
      return fn(...args);
    }
    return;
  };
  return newFn;
}

const countLineInFile = async (filePath: string) => {
  const readStream = fs.createReadStream(filePath);
  const readInterface = readline.createInterface({
    input: readStream,
    // output: process.stdout,
    // terminal: false
  });

  let lineCount = 0;
  for await (const _ of readInterface) {
    lineCount++;
  }
  return lineCount;
};

const processLogFile = async (filePath: string) => {
  const lineCount = await countLineInFile(filePath);

  console.log(`Processing ${filePath}`);
  const progressBar = new cliProgress.SingleBar({
    format:
      '[{bar}] {percentage}% | ETA: {eta_formatted} | Time: {duration_formatted} | {value}/{total}',
    barCompleteChar: '=',
    barIncompleteChar: '-',
  });
  progressBar.start(lineCount, 0, {
    speed: 'N/A',
  });

  const readStream = fs.createReadStream(filePath);
  const readInterface = readline.createInterface({
    input: readStream,
    // output: process.stdout,
    // terminal: false
  });

  for await (const line of readInterface) {
    try {
      // console.log(line);
      await skipIfDryRun(parseLog)(line);
      progressBar.increment();
    } catch (error) {
      console.log(error);
    }
  }
  progressBar.stop();
  console.log();
};

const main = async () => {
  dotenv.config();

  console.log();
  console.log('Connecting Mongo...');
  await skipIfDryRun(connectMongo, false)();
  console.log('Connected to Mongo');
  console.log();

  const paths = glob.sync('./../../log/**/app.log*');
  for (const path of paths) {
    await processLogFile(path);
  }

  console.log();
  console.log('Disconnecting Mongo...');
  await skipIfDryRun(disconnectMongo, false)();
  console.log('Disconnected to Mongo');
  console.log();
};

main();
