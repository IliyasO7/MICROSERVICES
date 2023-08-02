import mongoose from 'mongoose';
import { connectMongoDB } from '../../../shared/utils/db.js';
import { connectRedis } from '../../../shared/utils/redis.js';

export default async function boot() {
  await connectMongoDB();
  await connectRedis();
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'dev',
  });
  console.log('Booted successfully');
}
