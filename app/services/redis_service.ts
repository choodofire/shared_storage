import redis from '@adonisjs/redis/services/main'
import { IRedisService } from '#interfaces/i_redis_service'

export default class RedisService implements IRedisService {
  // Only sets the key if it does not already exist.
  async setNotExistsPersistKey(key: string, value: object): Promise<string | null> {
    const result = await redis.set(key, JSON.stringify(value), 'NX')
    if (!result) {
      return null
    }
    return key
  }

  // Only sets the key if it already exists.
  async setExistsPersistKey(key: string, value: object): Promise<string | null> {
    const result = await redis.set(key, JSON.stringify(value), 'XX')
    if (!result) {
      return null
    }
    return key
  }

  // Only sets the key if it does not already exist. Lifetime in seconds
  async setNotExistsTimeKey(key: string, value: object, lifetime: number): Promise<string | null> {
    const result = await redis.set(key, JSON.stringify(value), 'EX', lifetime, 'NX')
    if (!result) {
      return null
    }
    return key
  }

  // Only sets the key if it already exists. Lifetime in seconds
  async setExistsTimeKey(key: string, value: object, lifetime: number): Promise<string | null> {
    const result = await redis.set(key, JSON.stringify(value), 'EX', lifetime, 'XX')
    if (!result) {
      return null
    }
    return key
  }

  // Sets an expiry only when the key has an existing expiry.
  async updateExistsLifetime(key: string, lifetime: number): Promise<string | null> {
    const lifetimeMillSec = lifetime * 1000
    const result = await redis.expire(key, lifetimeMillSec, 'XX')
    if (!result) {
      return null
    }
    return key
  }

  // Sets an expiry only when the key has no expiry.
  async updateNotExistsLifetime(key: string, lifetime: number): Promise<string | null> {
    const lifetimeMillSec = lifetime * 1000
    const result = await redis.expire(key, lifetimeMillSec, 'NX')
    if (!result) {
      return null
    }
    return key
  }

  // delete redis key
  async deleteKey(key: string): Promise<number> {
    return redis.del(key)
  }

  // delete array of redis keys
  async deleteManyKeys(keys: string[]): Promise<number> {
    return redis.del(keys)
  }

  // get value of key
  async getValueByKey(key: string): Promise<string | null> {
    return redis.get(key)
  }

  async isKeySet(key: string): Promise<boolean> {
    const value = await redis.get(key)
    return !!value
  }
}
