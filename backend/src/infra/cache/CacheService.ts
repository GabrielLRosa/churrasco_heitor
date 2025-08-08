import { getRedisClient } from '@config/redis';
import logger from '@config/logger';

class CacheService {
  private readonly redis = getRedisClient();

  async get(key: string): Promise<any> {
    try {
      if (this.redis) {
        const value = await this.redis.get(key);
        if (value) {
          return JSON.parse(value);
        }
      }
    } catch (error) {
      logger.error('Cache get error:', error);
    }
    return null;
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.del(key);
      }
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.flushdb();
      }
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  }
}

export const cache = new CacheService(); 