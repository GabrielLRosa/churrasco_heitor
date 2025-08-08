# Cache com Redis

Este projeto usa Redis para fazer cache das consultas de checklist.

## Como funciona

- As consultas de listagem ficam guardadas no Redis por 5 minutos
- Quando alguém cria um checklist novo, limpa todo o cache
- Se o Redis não estiver funcionando, a aplicação continua normalmente

## Configuração

O Redis é configurado no Docker Compose usando variáveis de ambiente:

```yaml
redis:
  image: redis:alpine
  ports:
    - "${REDIS_PORT}:6379"
```

### Variáveis de Ambiente

```bash
REDIS_HOST=redis     # Host do Redis (padrão: redis)
REDIS_PORT=6379      # Porta do Redis (padrão: 6379)
REDIS_DB=0           # Database do Redis (padrão: 0)
```

**Importante**: A porta `REDIS_PORT` é usada tanto no Docker Compose para mapear a porta do host, quanto na aplicação para conectar ao Redis.

## Código

### Conexão com Redis (`src/config/redis.ts`)
```typescript
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
```

### Cache Service (`src/infra/cache/CacheService.ts`)
```typescript
import { getRedisClient } from '@config/redis';
import logger from '@config/logger';

class CacheService {
  private redis = getRedisClient();

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
```

### Uso no Repository
```typescript
import { cache } from '@infra/cache/CacheService';

export class SequelizeChecklistRepository implements ChecklistRepository {

  async create(checklistData: ChecklistAttributes): Promise<ChecklistAttributes> {
    const newChecklist = await ChecklistModel.create(checklistData);
    
    try {
      await cache.clear();
    } catch (error) {
      console.log('Failed to clear cache:', error);
    }
    
    return newChecklist.toJSON();
  }

  async list(where: any, order: Array<[string, string]>, limit: number, offset: number) {
    const cacheKey = `checklist_list_${JSON.stringify(where)}_${JSON.stringify(order)}_${limit}_${offset}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    const { rows, count } = await ChecklistModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    const result = {
      checklists: rows.map(row => row.toJSON()),
      totalCount: count,
    };
    
    await cache.set(cacheKey, result, 300);
    
    return result;
  }
}
```

## Como usar

1. Configurar as variáveis de ambiente (opcional, já tem valores padrão)
2. Subir o projeto com Docker Compose: `docker compose up`
3. O Redis vai estar disponível automaticamente
4. As consultas de listagem vão ser cacheadas automaticamente
5. Se o Redis der problema, a aplicação continua funcionando

Implementação direta e eficiente! 