import mongoose from 'mongoose';

mongoose.set('strictQuery', true);
mongoose.set('id', false);
mongoose.set('toJSON', { getters: true, versionKey: false });

mongoose.set('debug', process.env.NODE_ENV === 'development');

mongoose.connection.on('error', console.log);

export async function connectMongoDB() {
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'dev',
  });

  console.log('MongoDB is connected');
}
