import type { HttpContext } from '@adonisjs/core/http'
import { httpLockValidator } from '#validators/http_lock_request'
import {
  acquireLockValidator,
  ensureLockValidator,
  extendLockValidator,
  persistLockValidator,
  pollLockListValidator,
  pollLockValidator,
  releaseLockValidator,
} from '#validators/locks'
import { inject } from '@adonisjs/core'
import LockService from '#services/lock_service'
import { exhaustiveCheck } from '#helpers/exhaustive_check'

@inject()
export default class LocksController {
  constructor(protected readonly lockService: LockService) {}

  async index({ response, auth }: HttpContext) {
    const authUser = auth.use('api').user
    if (!authUser || authUser.role > 1) {
      return response.forbidden({
        errors: [{ code: 'E_ROW_NOT_FOUND', message: 'You can`t do it.' }],
      })
    }
  }

  async store({ request, response, auth }: HttpContext) {
    const authUser = auth.use('api').user
    if (!authUser) {
      return response.forbidden({
        errors: [{ code: 'E_ROW_NOT_FOUND', message: 'You can`t do it.' }],
      })
    }
    const params = request.qs()
    const body = request.body()

    const { method } = await httpLockValidator.validate({
      method: params.method,
    })

    switch (method) {
      case 'Acquire':
        const acquire = await acquireLockValidator.validate(body)
        return await this.lockService.acquire(acquire)
      case 'Ensure':
        const ensure = await ensureLockValidator.validate(body)
        return await this.lockService.ensure(ensure)
      case 'Extend':
        const extend = await extendLockValidator.validate(body)
        return await this.lockService.extend(extend)
      case 'Persist':
        const persist = await persistLockValidator.validate(body)
        return await this.lockService.persist(persist)
      case 'Poll':
        const poll = await pollLockValidator.validate(body)
        return await this.lockService.poll(poll)
      case 'PollList':
        const pollList = await pollLockListValidator.validate(body)
        return await this.lockService.pollList(pollList)
      case 'Release':
        const release = await releaseLockValidator.validate(body)
        return await this.lockService.release(release)
      default:
        exhaustiveCheck(method)
    }
  }

  async show({ request, response, auth }: HttpContext) {
    const authUser = auth.use('api').user
    if (!authUser || authUser.role > 2) {
      return response.forbidden({
        errors: [{ code: 'E_ROW_NOT_FOUND', message: 'You can`t do it.' }],
      })
    }

    const lock = await this.lockService.poll({
      ticket: request.param('id'),
      owner: authUser.email,
    })
    return lock
  }
}
