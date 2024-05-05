import { LockResponse } from '#helpers/protos/generated/lockService/LockResponse'
import { LockResponseNoTime } from '#helpers/protos/generated/lockService/LockResponseNoTime'
import { PollResponse } from '#helpers/protos/generated/lockService/PollResponse'
import { PollResponseList } from '#helpers/protos/generated/lockService/PollResponseList'
import {
  IAcquireLockRequest,
  IEnsureLockRequest,
  IExtendLockRequest,
  IPersistLockRequest,
  IPollLockListRequest,
  IPollLockRequest,
  IReleaseLockRequest,
} from '#interfaces/i_lock_requests'

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ILockService {
  acquire(data: IAcquireLockRequest): Promise<LockResponse>
  ensure(data: IEnsureLockRequest): Promise<LockResponse>
  extend(data: IExtendLockRequest): Promise<LockResponse>
  persist(data: IPersistLockRequest): Promise<LockResponseNoTime>
  poll(data: IPollLockRequest): Promise<PollResponse>
  pollList(data: IPollLockListRequest): Promise<PollResponseList>
  release(data: IReleaseLockRequest): Promise<LockResponseNoTime>
}
