import mongoose from 'mongoose'
import { connectMongoDB } from "../../../shared/utils/db.js";
// import { connectRedis } from "../../../shared/redis.js";

export default async function boot() {
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: "dev",
  });
  await connectMongoDB();
 //  await connectRedis();
  console.log("Booted successfully");
}
