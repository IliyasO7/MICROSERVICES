// import "../models/index";

import mongoose from 'mongoose';

mongoose.set('strictQuery', true);
mongoose.set('id', false);
mongoose.set('toJSON', { getters: true, versionKey: false });

mongoose.set('debug', (collectionName, methodName, methodArgs) => {
  if (process.env.NODE_ENV === 'production') return;
  if (methodName === 'createIndex') return;

  console.info(
    `\x1b[32mMongoose: ${collectionName}.${methodName}(${JSON.stringify(
      methodArgs
    )}) \x1b[0m`
  );
});

mongoose.connection.on('error', console.log);

export async function connectMongoDB() {
  console.log(process.env.MONGODB_URL);
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'housejoy-prod',
  });

  console.log('MongoDB is connected');
}

export async function connectMongoDBDev() {
  console.log(process.env.MONGODB_URL);
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'dev',
  });

  console.log('MongoDB is connected');
}
