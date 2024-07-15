export interface ILockController {
  AcquireLock(...args: any[]): Promise<any>
  EnsureLock(...args: any[]): Promise<any>
  ExtendLock(...args: any[]): Promise<any>
  PersistLock(...args: any[]): Promise<any>
  PollLock(...args: any[]): Promise<any>
  PollLockList(...args: any[]): Promise<any>
  ReleaseLock(...args: any[]): Promise<any>
}