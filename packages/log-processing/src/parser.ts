import {
  SetPeopleLogCollection,
  ResetBgLogCollection,
  NetpieLogCollection,
} from './model/netpie';

export const parseLogDateToDateTime = (onlyDate: string, onlyTime: string) => {
  const isoString = `${onlyDate}T${onlyTime}+07:00`;
  const dateTime = new Date(isoString);
  return dateTime;
};

export const parseLog = async (logString: string) => {
  // tslint:disable-next-line: max-line-length
  const netpieLogRegex = /^(?<full_date>(?:[0-9]{4})-(?:1[0-2]|0[1-9])-(?:3[01]|0[1-9]|[12][0-9])) (?<time>(?:2[0-3]|[01][0-9]):(?:[0-5][0-9]):(?:[0-5][0-9])(?:.(?:[0-9]+))) - (?:root|netpie) - INFO - (?<topic>\/\S*) -> b'(?<payload>\S*)'$/gm;
  // tslint:disable-next-line: max-line-length
  // const netpieLogRegex = /^(?<full_date>(?<YYYY>[0-9]{4})-(?<MM>1[0-2]|0[1-9])-(?<DD>3[01]|0[1-9]|[12][0-9])) (?<time>(?<hh>2[0-3]|[01][0-9]):(?<mm>[0-5][0-9]):(?<ss>[0-5][0-9])(?:.(?<SSS>[0-9]+))) - (?:root|netpie) - INFO - (?<topic>\/\S*) -> b'(?<payload>\S*)'$/gm;
  const m = netpieLogRegex.exec(logString);
  if (m !== null) {
    const topic = m.groups.topic;
    const payload = m.groups.payload;
    const date = parseLogDateToDateTime(
      m.groups.full_date,
      m.groups.time.replace(',', '.'),
    );

    if (topic === '/seniorproj/people/bg') {
      await ResetBgLogCollection.updateOne(
        { date },
        {
          $setOnInsert: {
            topic,
            payload,
            actualDate: new Date(payload),
          },
        },
        {
          upsert: true,
        },
      );
    } else if (topic === '/seniorproj/people/set') {
      await SetPeopleLogCollection.updateOne(
        { date },
        {
          $setOnInsert: {
            topic,
            payload,
            people: parseInt(payload, 10),
          },
        },
        {
          upsert: true,
        },
      );
    } else {
      // await NetpieLogCollection.updateOne(
      //   { date },
      //   {
      //     $setOnInsert: {
      //       topic,
      //       payload,
      //     },
      //   },
      //   {
      //     upsert: true,
      //   },
      // );
    }
  }
};
