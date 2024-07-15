import Redis from 'ioredis'

export interface IRedisService {
  readonly _redis: Redis
  // Only sets the key if it already exists.
  setExistsPersistKey(key: string, value: object): Promise<string | null>
  // Only sets the key if it does not already exist.
  setNotExistsPersistKey(key: string, value: object): Promise<string | null>
  // Only sets the key if it already exists. Lifetime in seconds.
  setExistsTimeKey(key: string, value: object, lifetime: number): Promise<string | null>
  // Only sets the key if it does not already exist. Lifetime in seconds.
  setNotExistsTimeKey(key: string, value: object, lifetime: number): Promise<string | null>
  // get value of key.
  getValueByKey(key: string): Promise<string | null>
  // Check if the key is locked.
  isKeySet(key: string): Promise<boolean>
  // Sets an expiry only when the key has an existing expiry.
  updateExistsLifetime(key: string, lifetime: number): Promise<string | null>
  // Sets an expiry only when the key has no expiry.
  updateNotExistsLifetime(key: string, lifetime: number): Promise<string | null>
  // delete redis key.
  deleteKey(key: string): Promise<number | null>
  // delete array of redis keys.
  deleteManyKeys(keys: string[]): Promise<number | null>
}