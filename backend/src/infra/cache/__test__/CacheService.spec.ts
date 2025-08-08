import { cache } from '../CacheService';

jest.mock('@config/redis', () => ({
  getRedisClient: () => null
}));

describe('CacheService', () => {
  it('should return null when redis is not available', async () => {
    const result = await cache.get('test-key');
    expect(result).toBeNull();
  });

  it('should not throw error when setting without redis', async () => {
    await expect(cache.set('test-key', 'test-value')).resolves.toBeUndefined();
  });

  it('should handle delete without redis gracefully', async () => {
    await expect(cache.del('test-key')).resolves.toBeUndefined();
  });

  it('should clear cache without throwing when no redis', async () => {
    await expect(cache.clear()).resolves.toBeUndefined();
  });
}); 