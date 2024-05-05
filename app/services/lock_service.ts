import { ILockService } from '#interfaces/i_lock_service'
import { LockResponse } from '#helpers/protos/generated/lockService/LockResponse'
import {
  IAcquireLockRequest,
  IEnsureLockRequest,
  IExtendLockRequest,
  IPersistLockRequest,
  IPollLockListRequest,
  IPollLockRequest,
  IReleaseLockRequest,
} from '#interfaces/i_lock_requests'
import { LockResponseNoTime } from '#helpers/protos/generated/lockService/LockResponseNoTime'
import RedisService from '#services/redis_service'
import { inject } from '@adonisjs/core'
import { TicketStatus } from '#helpers/ticket_statuses'
import { PollResponse } from '#helpers/protos/generated/lockService/PollResponse'
import { PollResponseList } from '#helpers/protos/generated/lockService/PollResponseList'

@inject()
export default class LockService implements ILockService {
  constructor(protected readonly redisService: RedisService) {}

  // Sets a temporary lock if the key is not yet set.
  async acquire(data: IAcquireLockRequest): Promise<LockResponse> {
    const { ticket, lifetime } = data
    const ticketRedis = await this.redisService.setNotExistsTimeKey(ticket, data, lifetime)
    if (!ticketRedis) {
      return {
        isError: true,
        wastedTime: 0,
        lock: data,
        message: TicketStatus.AlreadyLocked,
      }
    }
    return {
      isError: false,
      wastedTime: 0,
      lock: data,
      message: TicketStatus.SuccessLock,
    }
  }

  async ensure(data: IEnsureLockRequest): Promise<LockResponse> {
    const { ticket, owner, lifetime } = data
    const ticketRedis = await this.redisService.getValueByKey(ticket)

    if (!ticketRedis) {
      const ticketRedisNew = await this.redisService.setNotExistsTimeKey(ticket, data, lifetime)
      if (!ticketRedisNew) {
        return {
          isError: true,
          lock: data,
          wastedTime: 0,
          message: TicketStatus.AlreadyLocked,
        }
      }

      return {
        isError: false,
        lock: data,
        wastedTime: 0,
        message: TicketStatus.SuccessLock,
      }
    }

    const { owner: oldOwner } = JSON.parse(ticketRedis)
    if (oldOwner !== owner) {
      return {
        isError: true,
        lock: data,
        wastedTime: 0,
        message: TicketStatus.AlreadyLockedAnotherOwner,
      }
    }

    const ticketRedisLT = await this.redisService.updateExistsLifetime(ticket, lifetime)
    if (!ticketRedisLT) {
      return {
        isError: true,
        lock: data,
        wastedTime: 0,
        message: TicketStatus.NotLocked,
      }
    }

    return {
      isError: false,
      lock: data,
      wastedTime: 0,
      message: TicketStatus.SuccessLock,
    }
  }

  async extend(data: IExtendLockRequest): Promise<LockResponse> {
    const { ticket, owner, lifetime } = data
    const ticketRedis = await this.redisService.getValueByKey(ticket)
    if (!ticketRedis) {
      return {
        isError: true,
        lock: data,
        wastedTime: 0,
        message: TicketStatus.NotLocked,
      }
    }

    const { owner: oldOwner } = JSON.parse(ticketRedis)
    if (oldOwner !== owner) {
      return {
        isError: true,
        lock: data,
        wastedTime: 0,
        message: TicketStatus.AlreadyLockedAnotherOwner,
      }
    }
    const ticketRedisLT = await this.redisService.updateExistsLifetime(ticket, lifetime)
    if (!ticketRedisLT) {
      return {
        isError: true,
        lock: data,
        wastedTime: 0,
        message: TicketStatus.NotLocked,
      }
    }

    return {
      isError: false,
      lock: data,
      wastedTime: 0,
      message: TicketStatus.SuccessLock,
    }
  }

  async persist(data: IPersistLockRequest): Promise<LockResponseNoTime> {
    const { ticket } = data
    const ticketRedis = await this.redisService.setNotExistsPersistKey(ticket, data)
    if (!ticketRedis) {
      return {
        isError: true,
        lock: data,
        wastedTime: 0,
        message: TicketStatus.AlreadyLocked,
      }
    }

    return {
      isError: false,
      lock: data,
      wastedTime: 0,
      message: TicketStatus.SuccessLock,
    }
  }

  async poll(data: IPollLockRequest): Promise<PollResponse> {
    const { ticket } = data
    const ticketRedis = await this.redisService.isKeySet(ticket)
    return {
      isError: false,
      isBlocked: ticketRedis,
      lock: data,
      wastedTime: 0,
    }
  }

  async pollList(data: IPollLockListRequest): Promise<PollResponseList> {
    const { tickets, owner } = data
    const responses = []
    let isBlockedOne = false

    for (const ticket of tickets) {
      const ticketRedis = await this.redisService.isKeySet(ticket)

      if (ticketRedis) {
        isBlockedOne = true
      }

      responses.push({
        isError: false,
        lock: {
          ticket,
          owner,
        },
        wastedTime: 0,
        isBlocked: ticketRedis,
      })
    }
    return {
      responses,
      isBlocked: isBlockedOne,
    }
  }

  async release(data: IReleaseLockRequest): Promise<LockResponseNoTime> {
    const { ticket, owner } = data
    const ticketRedis = await this.redisService.getValueByKey(ticket)
    if (!ticketRedis) {
      return {
        isError: true,
        lock: data,
        wastedTime: 0,
        message: TicketStatus.NotLocked,
      }
    }

    const { owner: oldOwner } = JSON.parse(ticketRedis)
    if (oldOwner !== owner) {
      return {
        isError: true,
        lock: data,
        wastedTime: 0,
        message: TicketStatus.AlreadyLockedAnotherOwner,
      }
    }
    await this.redisService.deleteKey(ticket)
    return {
      isError: false,
      lock: data,
      wastedTime: 0,
      message: TicketStatus.SuccessUnlock,
    }
  }
}
