import Redis from "ioredis";

interface CacheInterface {
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  del(key: string): Promise<void>;
  flush(): Promise<void>;
}

class InMemoryCache implements CacheInterface {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async flush(): Promise<void> {
    this.cache.clear();
  }
}

class RedisCache implements CacheInterface {
  private client: Redis;

  constructor(url: string) {
    this.client = new Redis(url, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
    });

    this.client.on("error", (err) => {
      console.warn("⚠️ [Redis Cache] Connection error:", err.message);
    });
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    try {
      const data = JSON.stringify(value);
      await this.client.set(key, data, "EX", ttlSeconds);
    } catch (err) {
      console.error("[Redis Cache] SET error:", err);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      console.error("[Redis Cache] GET error:", err);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error("[Redis Cache] DEL error:", err);
    }
  }

  async flush(): Promise<void> {
    try {
      await this.client.flushall();
    } catch (err) {
      console.error("[Redis Cache] FLUSH error:", err);
    }
  }
}

// Instantiate cache helper based on REDIS_URL environment variable
const redisUrl = process.env.REDIS_URL;
let cacheInstance: CacheInterface;

if (redisUrl) {
  console.log(`🔌 [Cache] Connecting to Redis at ${redisUrl}...`);
  cacheInstance = new RedisCache(redisUrl);
} else {
  console.log("ℹ️ [Cache] REDIS_URL not configured. Running in-memory cache.");
  cacheInstance = new InMemoryCache();
}

export const cache = cacheInstance;
