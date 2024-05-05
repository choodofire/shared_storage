import type { HttpContext } from '@adonisjs/core/http'
import { loginAuthValidator } from '#validators/auth'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class AuthController {
  async login({ request, response, auth }: HttpContext) {
    if (auth.use('api').isAuthenticated) {
      return response.unauthorized({
        errors: [{ code: 'E_NOT_ALLOWED', message: 'Already logged in.' }],
      })
    }

    const { login, password } = await loginAuthValidator.validate(request.all())
    const user = await User.verifyCredentials(login, password)

    const token = await auth.use('api').authenticateAsClient(user)
    user.loginAt = DateTime.now()
    await user.save()

    return { ...token, user }
  }

  async logout({}: HttpContext) {}
}
