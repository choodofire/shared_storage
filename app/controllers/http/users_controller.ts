import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, idUserValidator, updateUserValidator } from '#validators/user'
import User from '#models/user'
import { userlogMethod } from '#helpers/decorators/userlog'

export default class UsersController {
  /**
   * @index
   * @summary Получение списка пользователей
   * @param page - 1
   * @param per_page - 100
   * @responseBody 200 - <User[]>.paginated()
   * @responseBody 401 - {"errors": [{"message": "Unauthorized access" }]}
   * @responseBody 403 - {"errors": [{ "code": "E_ROW_NOT_FOUND", "message": "You can`t do it." }]}
   */
  @userlogMethod('User', '', 'id')
  async index({ request, response, auth }: HttpContext) {
    const authUser = auth.use('api').user
    if (!authUser || authUser.role > 2) {
      return response.forbidden({
        errors: [{ code: 'E_ROW_NOT_FOUND', message: 'You can`t do it.' }],
      })
    }

    const users = await User.query().paginate(
      request.input('page', 1),
      request.input('per_page', 100)
    )
    return users
  }

  /**
   * @store
   * @summary Создание пользователя
   * @requsetBody {"email": "admin@admin.ru", "password": "12345", "role": 1}
   * @responseBody 200 - <User>
   * @responseBody 401 - {"errors": [{"message": "Unauthorized access" }]}
   * @responseBody 409 - {"errors": [{"code": "E_ALREADY_EXISTS","message": "User with provided login or email already exists."}]}
   */
  async store({ request, response, auth }: HttpContext) {
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

  /**
   * @show
   * @summary Получение одного пользователя
   * @param id - 1
   * @responseBody 200 - <User>
   * @responseBody 401 - {"errors": [{"message": "Unauthorized access" }]}
   * @responseBody 404 - {"errors": [{ "code": "E_ROW_NOT_FOUND", "message": "Object not found." }]}
   */
  @userlogMethod('User', 'id')
  async show({ request, response }: HttpContext) {
    const { id } = await idUserValidator.validate({ id: request.param('id') })
    const user = await User.query().where('id', id).first()
    if (!user) {
      return response.notFound({
        errors: [{ code: 'E_ROW_NOT_FOUND', message: 'Object not found.' }],
      })
    }
    return user
  }

  /**
   * @update
   * @summary Редактирование одного пользователя
   * @param id - 1
   * @responseBody 200 - <User>
   * @responseBody 401 - {"errors": [{"message": "Unauthorized access" }]}
   */
  @userlogMethod('User', 'id')
  async update({ request }: HttpContext) {
    const id = request.param('id')
    const payload = await updateUserValidator.validate(Object.assign(request.all(), { id }))

    const user = await User.query().where('id', payload.id).update(payload).first()
    return user
  }

  /**
   * @destroy
   * @summary Удаление одного пользователя
   * @param id - 1
   * @responseBody 200 - <User>
   * @responseBody 401 - {"errors": [{"message": "Unauthorized access" }]}
   * @responseBody 404 - {"errors": [{ "code": "E_ROW_NOT_FOUND", "message": "Object not found." }]}
   */
  @userlogMethod('User', 'id')
  async destroy({ request, response }: HttpContext) {
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
