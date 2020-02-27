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
