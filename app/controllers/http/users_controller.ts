import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, idUserValidator, updateUserValidator } from '#validators/user'
import User from '#models/user'

export default class UsersController {
  async index({ request, response, auth }: HttpContext) {
    const authUser = auth.use('api').user
    if (!authUser || authUser.role > 1) {
      return response.forbidden({
        errors: [{ code: 'E_ROW_NOT_FOUND', message: 'You can`t do it.' }],
      })
    }

    const users = await User.query()
    if (!users.length) {
      return response.notFound({
        errors: [{ code: 'E_ROW_NOT_FOUND', message: 'Object not found.' }],
      })
    }
    return users
  }

  async store({ request, response, auth }: HttpContext) {
    const auth_user = auth.use('api').user

    const payload = await createUserValidator.validate(request.all())
    const existingUser = await User.query().where('email', payload.email).first()
    if (existingUser) {
      return response.conflict({
        errors: [
          {
            code: 'E_ALREADY_EXISTS',
            message: 'User with provided login or email already exists.',
          },
        ],
      })
    }

    const newUser = await User.create(payload)
    const token = await auth.use('api').authenticateAsClient(newUser)
    return response.created({ ...token, newUser })
  }

  async show({ request, response, auth }: HttpContext) {
    const auth_user = auth.use('api').user

    const { id } = await idUserValidator.validate({ id: request.param('id') })
    const user = await User.query().where('id', id).first()
    if (!user) {
      return response.notFound({
        errors: [{ code: 'E_ROW_NOT_FOUND', message: 'Object not found.' }],
      })
    }
    return user
  }

  async update({ request, response, auth }: HttpContext) {
    const auth_user = auth.use('api').user

    const id = request.param('id')
    const payload = await updateUserValidator.validate(Object.assign(request.all(), { id }))

    const user = await User.query().where('id', payload.id).update(payload).first()
    return user
  }

  async destroy({ request, response, auth }: HttpContext) {
    const auth_user = auth.use('api').user

    const { id } = await idUserValidator.validate({ id: request.param('id') })
    const user = await User.query().where('id', id).first()
    if (!user) {
      return response.notFound({
        errors: [{ code: 'E_ROW_NOT_FOUND', message: 'Object not found.' }],
      })
    }
    await user.delete()
    return user
  }
}
