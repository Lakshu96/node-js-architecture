import { redisClient } from '../config/v1/redis';

const REDIS_EXPIRATION = parseInt(process.env.REDIS_EXPIRATION || '3600', 10); // Default 1 hour

export const setKey = async (
  key: string,
  data: any,
  expiration: number = REDIS_EXPIRATION
): Promise<boolean> => {
  console.log('RedisService@setKey');

  const hasSaved = await redisClient.set(key, JSON.stringify(data), {
    EX: expiration,
  });

  return !!hasSaved;
};

export const getAllKeys = async (): Promise<string[] | false> => {
  console.log('RedisService@getAllKeys');

  const keys = await redisClient.keys('*');
  return keys.length ? keys : false;
};

export const getAllSpecificKeys = async (
  keyPrefix: string
): Promise<string[] | false> => {
  console.log('RedisService@getAllSpecificKeys');

  const keys = await redisClient.keys(`${keyPrefix}*`);
  return keys.length ? keys : false;
};

export const getKey = async (key: string): Promise<any | false> => {
  console.log('RedisService@getKey');

  const data = await redisClient.get(key);
  if (!data) return false;

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('RedisService@getKey: JSON parse error', err);
    return false;
  }
};

export const getCount = async (): Promise<number | false> => {
  console.log('RedisService@getCount');

  const keys = await getAllKeys();
  return keys ? keys.length : false;
};

export const clearKey = async (key: string): Promise<boolean> => {
  console.log('RedisService@clearKey');

  const deletedKeyCount = await redisClient.del(key);
  return deletedKeyCount > 0;
};

export const flushAll = async (): Promise<boolean> => {
  console.log('RedisService@flushAll');

  const result = await redisClient.flushAll();
  return result === 'OK';
};
