import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import { LockRequest__Output } from '../protos/generated/lockService/LockRequest'
import { LockResponse } from '../protos/generated/lockService/LockResponse'
import {
  IAcquireLockRequest,
  IEnsureLockRequest,
  IExtendLockRequest,
  IPersistLockRequest,
  IPollLockListRequest,
  IPollLockRequest,
  IReleaseLockRequest
} from '../interfaces/ILockRequests'
import { LockRequestNoTime__Output } from '../protos/generated/lockService/LockRequestNoTime'
import { LockResponseNoTime } from '../protos/generated/lockService/LockResponseNoTime'
import { PollResponse } from '../protos/generated/lockService/PollResponse'
import { LockRequestNoTimeList__Output } from '../protos/generated/lockService/LockRequestNoTimeList'
import { PollResponseList } from '../protos/generated/lockService/PollResponseList'
import LockService from '../services/lockService'
import RedisService from '../services/redisService'
import { LockServiceHandlers } from '../protos/generated/lockService/LockService'
import { ILockController } from '../interfaces/ILockController'
import {ILockService} from '../interfaces/ILockService'

export default class GrpcController implements ILockController {
  private lockService: LockService
  constructor() {
    this.lockService = new LockService(new RedisService())
  }
  
  async AcquireLock(call: ServerUnaryCall<LockRequest__Output, LockResponse>, callback: sendUnaryData<LockResponse>): Promise<void> {
    const data = call.request as Required<IAcquireLockRequest>
    await this.lockService.acquire(data)
      .then(response => callback(null, response))
      .catch(error => callback(error, null))
  }
  
  async EnsureLock(call: ServerUnaryCall<LockRequest__Output, LockResponse>, callback: sendUnaryData<LockResponse>): Promise<void> {
    const data = call.request as Required<IEnsureLockRequest>
    await this.lockService.ensure(data)
      .then(response => callback(null, response))
      .catch(error => callback(error, null))
  }
  
  async ExtendLock(call: ServerUnaryCall<LockRequest__Output, LockResponse>, callback: sendUnaryData<LockResponse>): Promise<void> {
    const data = call.request as Required<IExtendLockRequest>
    await this.lockService.extend(data)
      .then(response => callback(null, response))
      .catch(error => callback(error, null))
  }
  
  async PersistLock(call: ServerUnaryCall<LockRequestNoTime__Output, LockResponseNoTime>, callback: sendUnaryData<LockResponseNoTime>): Promise<void> {
    const data = call.request as Required<IPersistLockRequest>
    await this.lockService.persist(data)
      .then(response => callback(null, response))
      .catch(error => callback(error, null))
  }
  
  async PollLock(call: ServerUnaryCall<LockRequestNoTime__Output, PollResponse>, callback: sendUnaryData<PollResponse>): Promise<void> {
    const data = call.request as Required<IPollLockRequest>
    await this.lockService.poll(data)
      .then(response => callback(null, response))
      .catch(error => callback(error, null))
  }
  
  async PollLockList(call: ServerUnaryCall<LockRequestNoTimeList__Output, PollResponseList>, callback: sendUnaryData<PollResponseList>): Promise<void> {
    const data = call.request as Required<IPollLockListRequest>
    await this.lockService.pollList(data)
      .then(response => callback(null, response))
      .catch(error => callback(error, null))
  }
  
  async ReleaseLock(call: ServerUnaryCall<LockRequestNoTime__Output, LockResponseNoTime>, callback: sendUnaryData<LockResponseNoTime>): Promise<void> {
    const data = call.request as Required<IReleaseLockRequest>
    await this.lockService.release(data)
      .then(response => callback(null, response))
      .catch(error => callback(error, null))
  }
}
