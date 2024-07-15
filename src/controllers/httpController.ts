import express, { NextFunction, Request, Response} from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { exhaustiveCheck } from '../helpers/exhaustiveCheck'
import { httpLockValidator } from '../validators/httpLockRequest'
import {
  acquireLockValidator,
  ensureLockValidator,
  extendLockValidator,
  pollLockListValidator,
  persistLockValidator,
  releaseLockValidator,
  pollLockValidator,
} from '../validators/lock'
import LockService from '../services/lockService'
import RedisService from '../services/redisService'
import { handleErrorAsync } from '../helpers/ErrorAsyncHandler'


const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const lockService = new LockService(new RedisService())

app.post('/lock/:method/', handleErrorAsync(async function(req: Request, res: Response, next: NextFunction) {
    const params = req.params
    const body = req.body
    
    const { method } = await httpLockValidator.validate({
      method: params.method.toLowerCase(),
    })
    switch (method) {
      case 'acquire':
        const acquireVal = await acquireLockValidator.validate(body)
        const acquire = await lockService.acquire(acquireVal)
        return res.status(200).json(acquire)
      case 'ensure':
        const ensureVal = await ensureLockValidator.validate(body)
        const ensure = await lockService.ensure(ensureVal)
        return res.status(200).json(ensure)
      case 'extend':
        const extendVal = await extendLockValidator.validate(body)
        const extend = lockService.extend(extendVal)
        return res.status(200).json(extend)
      case 'persist':
        const persistVal = await persistLockValidator.validate(body)
        const persist = lockService.persist(persistVal)
        return res.status(200).json(persist)
      case 'poll':
        const pollVal = await pollLockValidator.validate(body)
        const poll = lockService.poll(pollVal)
        return res.status(200).json(poll)
      case 'pollList':
        const pollListVal = await pollLockListValidator.validate(body)
        const pollList = lockService.pollList(pollListVal)
        return res.status(200).json(pollList)
      case 'release':
        const releaseVal = await releaseLockValidator.validate(body)
        const release = lockService.release(releaseVal)
        return res.status(200).json(release)
      default:
        exhaustiveCheck(method)
    }
  })
)


/* GET 404 page. */
app.use('*', function(req, res, next) {
  res.status(404).json({ errors: [{ code: 'E_NOT_FOUND', message: "Page not found." }]})
})

export default app
