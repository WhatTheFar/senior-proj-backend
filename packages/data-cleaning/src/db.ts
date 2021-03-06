import * as mongoose from 'mongoose';

export const connectMongo = async () => {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  const uri = `mongodb://${user}:${password}@${host}:27017`;
  const options: mongoose.ConnectionOptions = {
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

export async function withMongo(fn: () => Promise<void>) {
  console.log();
  console.log('Connecting Mongo...');
  await connectMongo();
  console.log('Connected to Mongo');
  console.log();

  try {
    await fn();
  } catch (error) {
    throw error;
  }

  console.log();
  console.log('Disconnecting Mongo...');
  await disconnectMongo();
  console.log('Disconnected to Mongo');
  console.log();
}
