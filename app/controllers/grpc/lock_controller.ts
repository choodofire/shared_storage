import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import { LockRequest__Output } from '#helpers/protos/generated/lockService/LockRequest'
import { LockResponse } from '#helpers/protos/generated/lockService/LockResponse'
import {
  acquireLockValidator,
  ensureLockValidator,
  extendLockValidator,
  persistLockValidator,
  pollLockListValidator,
  pollLockValidator,
  releaseLockValidator,
} from '#validators/lock_request'
import LockService from '#services/lock_service'
import { PollResponse } from '#helpers/protos/generated/lockService/PollResponse'
import { PollResponseList } from '#helpers/protos/generated/lockService/PollResponseList'
import { LockRequestNoTime__Output } from '#helpers/protos/generated/lockService/LockRequestNoTime'
import { LockResponseNoTime } from '#helpers/protos/generated/lockService/LockResponseNoTime'
import { LockRequestNoTimeList__Output } from '#helpers/protos/generated/lockService/LockRequestNoTimeList'
import { ILockController } from '#interfaces/i_lock_controller'
import {
  IAcquireLockRequest,
  IEnsureLockRequest,
  IExtendLockRequest,
  IPersistLockRequest,
  IPollLockListRequest,
  IPollLockRequest,
  IReleaseLockRequest,
} from '#interfaces/i_lock_requests'
import { inject } from '@adonisjs/core'

@inject()
export default class LockController implements ILockController {
  constructor(protected readonly lockService: LockService) {}

  async AcquireLock(
    call: ServerUnaryCall<LockRequest__Output, LockResponse>,
    callback: sendUnaryData<LockResponse>
  ): Promise<void> {
    const data: IAcquireLockRequest = await acquireLockValidator.validate(call.request)
    const result = await this.lockService.acquire(data)
    callback(null, result)
  }

  async EnsureLock(
    call: ServerUnaryCall<LockRequest__Output, LockResponse>,
    callback: sendUnaryData<LockResponse>
  ): Promise<void> {
    const data: IEnsureLockRequest = await ensureLockValidator.validate(call.request)
    const result = await this.lockService.ensure(data)
    callback(null, result)
  }

  async ExtendLock(
    call: ServerUnaryCall<LockRequest__Output, LockResponse>,
    callback: sendUnaryData<LockResponse>
  ): Promise<void> {
    const data: IExtendLockRequest = await extendLockValidator.validate(call.request)
    const result = await this.lockService.extend(data)
    callback(null, result)
  }

  async PersistLock(
    call: ServerUnaryCall<LockRequestNoTime__Output, LockResponseNoTime>,
    callback: sendUnaryData<LockResponseNoTime>
  ): Promise<void> {
    const data: IPersistLockRequest = await persistLockValidator.validate(call.request)
    const result = await this.lockService.persist(data)
    callback(null, result)
  }

  async PollLock(
    call: ServerUnaryCall<LockRequestNoTime__Output, PollResponse>,
    callback: sendUnaryData<PollResponse>
  ): Promise<void> {
    const data: IPollLockRequest = await pollLockValidator.validate(call.request)
    const result = await this.lockService.poll(data)
    callback(null, result)
  }

  async PollLockList(
    call: ServerUnaryCall<LockRequestNoTimeList__Output, PollResponseList>,
    callback: sendUnaryData<PollResponseList>
  ): Promise<void> {
    const data: IPollLockListRequest = await pollLockListValidator.validate(call.request)
    const result = await this.lockService.pollList(data)
    callback(null, result)
  }

  async ReleaseLock(
    call: ServerUnaryCall<LockRequestNoTime__Output, LockResponseNoTime>,
    callback: sendUnaryData<LockResponseNoTime>
  ): Promise<void> {
    const data: IReleaseLockRequest = await releaseLockValidator.validate(call.request)
    const result = await this.lockService.release(data)
    callback(null, result)
  }
}
