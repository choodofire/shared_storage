// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IRedisService {
  setExistsPersistKey(key: string, value: object): Promise<string | null>
  setNotExistsPersistKey(key: string, value: object): Promise<string | null>
  setExistsTimeKey(key: string, value: object, lifetime: number): Promise<string | null>
  setNotExistsTimeKey(key: string, value: object, lifetime: number): Promise<string | null>
  getValueByKey(key: string): Promise<string | null>
  isKeySet(key: string): Promise<boolean>
  updateExistsLifetime(key: string, lifetime: number): Promise<string | null>
  updateNotExistsLifetime(key: string, lifetime: number): Promise<string | null>
  deleteKey(key: string): Promise<number | null>
  deleteManyKeys(keys: string[]): Promise<number | null>
}
