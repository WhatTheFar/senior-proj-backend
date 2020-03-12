import * as mongoose from 'mongoose';
import * as cliProgress from 'cli-progress';

export async function* mongooseCursorAsyncGenerator<
  DocType extends mongoose.Document
>(cursor: mongoose.QueryCursor<DocType>): AsyncGenerator<DocType> {
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    yield doc;
  }
}

export function createSingleProgressBar() {
  const progressBar = new cliProgress.SingleBar({
    format:
      '[{bar}] {percentage}% | ETA: {eta_formatted} | Time: {duration_formatted} | {value}/{total}',
    barCompleteChar: '=',
    barIncompleteChar: '-',
  });
  return progressBar;
}

export async function iterateAsyncGeneratorWithProgressBar<T>(
  generator: AsyncGenerator<T>,
  count: number,
  callback: (element: T) => Promise<void>,
) {
  const progressBar = createSingleProgressBar();
  progressBar.start(count, 0);

  for await (const element of generator) {
    await callback(element);

    await progressBar.increment();
  }
  await progressBar.stop();
}

export async function iterateMongoQueryWithProgressBar<
  DocType extends mongoose.Document
>(
  query: mongoose.DocumentQuery<DocType[], DocType>,
  callback: (element: DocType) => Promise<void>,
) {
  const count = await query.countDocuments();
  const cursor = query.cursor();
  const generator = mongooseCursorAsyncGenerator(cursor);
  await iterateAsyncGeneratorWithProgressBar(generator, count, callback);
}

export async function executeWithOneStepProgressBar(fn: () => Promise<void>) {
  const progressBar = createSingleProgressBar();
  progressBar.start(1, 0);

  try {
    await fn();
    await progressBar.increment();
    await progressBar.stop();
  } catch (error) {
    await progressBar.stop();
    throw error;
  }
}
