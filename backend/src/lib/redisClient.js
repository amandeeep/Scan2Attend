// src/config/redis.js
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // important for Upstash (it uses rediss://)
    rejectUnauthorized: false,
  },
});

redisClient.on("connect", () => console.log("✅ Redis connected (Upstash)"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

await redisClient.connect();

export default redisClient;
