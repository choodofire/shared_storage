import type { HttpContext } from '@adonisjs/core/http'
import { loginAuthValidator } from '#validators/auth'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class AuthController {
  /**
   * @login
   * @summary Авторизация (получение bearer-токена)
   * @requestBody {"login": "admin@admin.com","password": "12345"}
   * @responseBody 200 - <User>.append("token": {"type": "bearer", "token": "oat_OA.b2U4dUJNVV9WWnlOM0NicWQzQW55Z1pqZWpxa2NINDV2Y1JQRWhEXzMxMDYzMjkyNDc"})
   * @responseBody 400 - {"errors": [{ "code": "E_NOT_ALLOWED", "message": "Already logged in."}]}
   * @responseBody 401 - {"errors": [{"message": "Invalid user credentials"}]}
   */
  async login({ request, response, auth }: HttpContext) {
    if (auth.use('api').isAuthenticated) {
      return response.badRequest({
        errors: [{ code: 'E_NOT_ALLOWED', message: 'Already logged in.' }],
      })
    }

    const { login, password } = await loginAuthValidator.validate(request.all())
    const user = await User.verifyCredentials(login, password)

    const token = await auth.use('api').authenticateAsClient(user)
    user.loginAt = DateTime.now()
    await user.save()

    return { type: 'bearer', token: token.headers?.authorization, user }
  }

  /**
   * @logout
   * @summary Выход (аннулирование текущего переданного bearer-токена)
   * @responseBody 200 - {"revoked":true}
   * @responseBody 401 - {"errors": [{"message": "Unauthorized access" }]}
   * @responseBody 417 - {"errors": [{ "code": "E_NOT_AUTH", "message": "Auth is not correct." }]}
   * */
  async logout({ auth, response }: HttpContext) {
    const authUser = auth.use('api').user
    const token = authUser?.currentAccessToken.identifier
    if (!token) {
      return response.expectationFailed({
        errors: [{ code: 'E_NOT_AUTH', message: 'Auth is not correct.' }],
      })
    }
    await User.accessTokens.delete(authUser, token)
    return response.ok({ revoked: true })
  }

  /**
   * @me
   * @summary Почение информации по текущему пользователю
   * @responseBody 200 - <User>
   * @responseBody 401 - {"errors": [{"message": "Unauthorized access" }]}
   **/
  async me({ auth }: HttpContext) {
    return auth.use('api').user
  }
}
