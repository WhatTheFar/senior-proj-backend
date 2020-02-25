import * as mongoose from 'mongoose';

export const connectMongo = async () => {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  const uri = `mongodb://${user}:${password}@${host}:27017`;
  const options = {
    dbName: 'seniorproj',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, options);
  // return mongoose.connection;
};

export const disconnectMongo = async () => {
  await mongoose.disconnect();
};
