import { connectMongoDB } from '../../../shared/utils/db.js';

export default async function boot() {
  await connectMongoDB();
  // await connectRedis();
  console.log('Booted successfully');
}
