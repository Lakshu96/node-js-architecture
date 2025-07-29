import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const { REDIS_URL, REDIS_PORT } = process.env;

if (!REDIS_URL || !REDIS_PORT) {
  throw new Error('Missing REDIS_URL or REDIS_PORT in environment variables.');
}

// Create Redis connection URL
const redisUrl = `redis://${REDIS_URL}:${REDIS_PORT}`;

// Create Redis client
const redisClient = createClient({ url: redisUrl });

// Handle Redis events
redisClient.on('ready', () => {
  console.log('Redis is ready!');
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully!');
});

redisClient.on('error', (error: Error) => {
  console.error(`Redis Error: ${error.message}`);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
})();

export { redisClient };
