import { LockResponse } from '../protos/generated/lockService/LockResponse'
import { LockResponseNoTime } from '../protos/generated/lockService/LockResponseNoTime'
import { PollResponse } from '../protos/generated/lockService/PollResponse'
import { PollResponseList } from '../protos/generated/lockService/PollResponseList'
import {
  IAcquireLockRequest,
  IEnsureLockRequest,
  IExtendLockRequest,
  IPersistLockRequest,
  IPollLockListRequest,
  IPollLockRequest,
  IReleaseLockRequest,
} from './ILockRequests'

export interface ILockService {
  acquire(data: IAcquireLockRequest): Promise<LockResponse>
  ensure(data: IEnsureLockRequest): Promise<LockResponse>
  extend(data: IExtendLockRequest): Promise<LockResponse>
  persist(data: IPersistLockRequest): Promise<LockResponseNoTime>
  poll(data: IPollLockRequest): Promise<PollResponse>
  pollList(data: IPollLockListRequest): Promise<PollResponseList>
  release(data: IReleaseLockRequest): Promise<LockResponseNoTime>
}