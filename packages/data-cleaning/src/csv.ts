import * as fs from 'fs';
import { once } from 'events';
import * as util from 'util';
import * as stream from 'stream';

import { IIot, IIotDoc, IotModel, IotCollection } from './model/iot.model';
import { createSingleProgressBar, mkdirpSync } from './utils';

async function countSensorsByDate(options?: { start?: Date; end?: Date }) {
  const { start, end } = { ...options };

  const dateMatch = {} as any;
  if (start != null) {
    dateMatch.$gte = start;
  }
  if (end != null) {
    dateMatch.$lt = end;
  }

  const count = await IotModel.find({ date: dateMatch }).countDocuments();
  return count;
}

async function* getAllSensorsByDate(options?: {
  start?: Date;
  end?: Date;
}): AsyncGenerator<IIot> {
  const { start, end } = { ...options };

  const dateMatch = {} as any;
  if (start != null) {
    dateMatch.$gte = start;
  }
  if (end != null) {
    dateMatch.$lt = end;
  }

  const cursor = IotModel.find({ date: dateMatch })
    .sort({ date: -1 })
    .cursor();

  for await (const doc of cursor) {
    const iot: IIot = (doc as IIotDoc).toObject();
    yield iot;
  }
}

async function* getAllSensorsCSV(options?: {
  start?: Date;
  end?: Date;
  skip?: boolean;
}): AsyncGenerator<string> {
  const { start, end, skip } = { skip: false, ...options };

  const sensors = getAllSensorsByDate({ start, end });
  let csvString =
    'date,people,co2,hum1,hum2,hum3,hum4,temp1,temp2,temp3,temp4,light1,light2,light3,light4';
  yield csvString;

  for await (const row of sensors) {
    if (
      skip &&
      (row.multi.length !== 4 || row.co2.length !== 1 || row.people == null)
    ) {
      continue;
    }
    csvString = `\n${row.date.toISOString()}`;
    csvString += `,${row.people ? row.people.people : '-'}`;
    csvString += `,${row.co2[0] ? row.co2[0].co2 : '-'}`;

    const sortedMulti =
      row.multi != null
        ? row.multi.sort((l, r) => {
            return l.device - r.device;
          })
        : [];

    let humString = '';
    let tempString = '';
    let lightString = '';

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0, device = 1; device <= 4; device++) {
      const multi = sortedMulti[i];

      if (device > 1) {
        humString += ',';
        tempString += ',';
        lightString += ',';
      }
      if (multi == null || device < multi.device) {
        humString += '-';
        tempString += '-';
        lightString += '-';
      } else {
        humString += multi.hum;
        tempString += multi.temp;
        lightString += multi.light;
        i++;
      }
    }

    csvString += `,${humString},${tempString},${lightString}`;
    yield csvString;
  }
}

export async function generateCSV(options?: { start?: Date; end?: Date }) {
  const { start, end } = { ...options };

  mkdirpSync('./generated');

  const count = await countSensorsByDate({ start, end });

  const csvStringStream = getAllSensorsCSV({ start, end });
  const writingIterable = writeIterableToFile(
    csvStringStream,
    './generated/sensors.csv',
  );

  const progressBar = createSingleProgressBar();
  progressBar.start(count, 0);
  for await (const chunk of writingIterable) {
    await progressBar.increment();
  }
  await progressBar.stop();
}

const finished = util.promisify(stream.finished); // (A)

async function* writeIterableToFile(
  iterable: Iterable<string> | AsyncIterable<string>,
  filePath: string,
) {
  const writable = fs.createWriteStream(filePath, { encoding: 'utf8' });
  for await (const chunk of iterable) {
    if (!writable.write(chunk)) {
      // (B)
      // Handle backpressure
      await once(writable, 'drain');
    } else {
      yield;
    }
  }
  writable.end(); // (C)
  // Wait until done. Throws if there are errors.
  await finished(writable);
}
