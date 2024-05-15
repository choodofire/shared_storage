import { SimplePaginator } from '@adonisjs/lucid/database'
import { BaseModel } from '@adonisjs/lucid/orm'
import Userlog from '#models/userlog'
import { ModelAttributes } from '@adonisjs/lucid/types/model'

export const userlogMethod = (model: string, param?: string, responseParam?: string) => {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    let method = descriptor.value! // this is the wrapped function
    descriptor.value = async function (...args: any[]) {
      const { request, auth } = args[0]
      const authUser = auth.use('api').user
      let params: { params?: object; data?: Record<string, any> } = {}

      // Avoid double save params and empty objects
      let urlParams = Object.assign({}, request.params())
      if (param) {
        delete urlParams[param]
      }
      if (Object.keys(urlParams).length > 0) params.params = urlParams

      let data = Object.assign({}, request.all())
      if (Object.keys(data).length > 0) params.data = data

      let logEntry: ModelAttributes<Omit<Userlog, 'id' | 'createdAt' | 'updatedAt'>> = {
        entityType: model,
        entityId: param ? request.param(param) : null,
        entityIdArray: null,
        controller: target.constructor.name,
        method: methodName,
        userId: authUser ? authUser.id : 0,
        params: params.params ? params.params : {},
        archive: false,
      }

      if (!responseParam) {
        await Userlog.create(logEntry)
        return method.apply(target, args)
      }

      const result = await method.apply(target, args)
      if (result instanceof SimplePaginator) {
        const entityIdArray: string[] = []

        for (const item of result) {
          if (item instanceof BaseModel && responseParam in item.$attributes) {
            entityIdArray.push(item.$attributes[responseParam])
          }
        }

        logEntry.entityIdArray = entityIdArray
        await Userlog.create(logEntry)
      }
      return result
    }
  }
}

export default {
  userlogMethod,
}
