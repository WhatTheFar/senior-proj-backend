import { IIot, IIotDoc, IotModel, IotCollection } from './../model/iot.model';
import { executeWithOneStepProgressBar } from './utils';

export async function resetAllFlag() {
  // tslint:disable-next-line: no-console
  console.log('Unsetting all flag');

  await executeWithOneStepProgressBar(async () => {
    const updateResult = await IotCollection.updateMany(
      {},
      {
        $unset: {
          flag: '',
        },
      },
    );
  });
}
