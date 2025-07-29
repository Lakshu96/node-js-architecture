const { redisClient } = require('../config/v1/redis');

const setKey = async (key, data, expiration = process.env.REDIS_EXPIRATION) => {
    console.log('RedisService@setKey');

    let hasSaved = await redisClient.set(key, JSON.stringify(data), {
        'EX': expiration
    });
    if (!hasSaved) {
        return false;
    }

    return true;
}

const getAllKeys = async () => {
    console.log('RedisService@getAllKeys');

    let keys = await redisClient.keys(`*`);
    if (keys.length < 1) {
        return false;
    }

    return keys;
}

const getAllSpecificKeys = async (keyPrefix) => {
    console.log('RedisService@getAllSpecificKeys');

    let keys = await redisClient.keys(`${keyPrefix}*`);
    if (keys.length < 1) {
        return false;
    }

    return keys;
}

const getKey = async (key) => {
    console.log('RedisService@getKey');

    let data = await redisClient.get(key);
    if (!data) {
        return false;
    }

    return JSON.parse(data);
}

const getCount = async () => {
    console.log('RedisService@getCount');

    let data = await getAllKeys();
    if (!data) {
        return false;
    }

    return data.length;
}

const clearKey = async (key) => {
    console.log('RedisService@clearKey');

    let deletedKeyCount = await redisClient.del(key);
    if (deletedKeyCount < 1) {
        return false;
    }

    return true;
}

const flushAll = async () => {
    console.log('RedisService@flushAll');
    
    let flushAll = await redisClient.flushAll();
    if (flushAll < 1) {
        return false;
    }

    return true;
}

module.exports = {
    setKey,
    getAllKeys,
    getAllSpecificKeys,
    getKey,
    getCount,
    clearKey,
    flushAll
}