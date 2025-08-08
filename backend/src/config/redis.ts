import Redis from 'ioredis';
import logger from '@config/logger';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_DB = parseInt(process.env.REDIS_DB || '0', 10);

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!redisClient) {
    try {
      redisClient = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        db: REDIS_DB,
      });
      
      redisClient.on('error', (err) => {
        logger.error('Redis error:', err);
      });
      
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      return null;
    }
  }
  
  return redisClient;
} 