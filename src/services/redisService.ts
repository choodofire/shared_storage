import Redis from 'ioredis'
import { IRedisService } from "../interfaces/IRedisService";

export default class RedisService implements IRedisService {
  public readonly _redis: Redis
  constructor() {
    this._redis = new Redis({
      host: '127.0.0.1', // или IP адрес Docker-контейнера
      port: 6379,
    })
  }
  
  async setNotExistsPersistKey(key: string, value: object): Promise<string | null> {
    const result = await this._redis.set(key, JSON.stringify(value), 'NX')
    if (!result) {
      return null
    }
    return key
  }
  
  async setExistsPersistKey(key: string, value: object): Promise<string | null> {
    const result = await this._redis.set(key, JSON.stringify(value), 'XX')
    if (!result) {
      return null
    }
    return key
  }
  
  async setNotExistsTimeKey(key: string, value: object, lifetime: number): Promise<string | null> {
    const result = await this._redis.set(key, JSON.stringify(value), 'EX', lifetime, 'NX')
    if (!result) {
      return null
    }
    return key
  }
  
  async setExistsTimeKey(key: string, value: object, lifetime: number): Promise<string | null> {
    const result = await this._redis.set(key, JSON.stringify(value), 'EX', lifetime, 'XX')
    if (!result) {
      return null
    }
    return key
  }
  
  async updateExistsLifetime(key: string, lifetime: number): Promise<string | null> {
    const lifetimeMillSec = lifetime * 1000
    const result = await this._redis.expire(key, lifetimeMillSec, 'XX')
    if (!result) {
      return null
    }
    return key
  }
  
  async updateNotExistsLifetime(key: string, lifetime: number): Promise<string | null> {
    const lifetimeMillSec = lifetime * 1000
    const result = await this._redis.expire(key, lifetimeMillSec, 'NX')
    if (!result) {
      return null
    }
    return key
  }
  
  async deleteKey(key: string): Promise<number> {
    return this._redis.del(key)
  }
  
  async deleteManyKeys(keys: string[]): Promise<number> {
    return this._redis.del(keys)
  }
  
  async getValueByKey(key: string): Promise<string | null> {
    return this._redis.get(key)
  }
  
  async isKeySet(key: string): Promise<boolean> {
    const value = await this._redis.get(key)
    return !!value
  }
}