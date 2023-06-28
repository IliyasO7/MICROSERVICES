import { createClient } from "redis";

const redis = createClient({
  url: "redis://redis:6379",
});

export const connectRedis = async () => {
  await redis.connect();
  console.log("Redis connected");
};

export default redis;
