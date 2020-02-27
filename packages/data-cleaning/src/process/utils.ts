import * as mongoose from 'mongoose';

export async function* mongooseCursorAsyncGenerator<
  DocType extends mongoose.Document
>(cursor: mongoose.QueryCursor<DocType>): AsyncGenerator<DocType> {
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    yield doc;
  }
}
