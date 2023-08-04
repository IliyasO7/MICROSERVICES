import { connectMongoDB } from '../../../shared/utils/db.js';
import { connectRedis } from '../../../shared/utils/redis.js';

export default async function boot() {
  await connectMongoDB();
  await connectRedis();
  console.log('Booted successfully');
}
