import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'
const UsersController = () => import('#controllers/http/users_controller')
const AuthController = () => import('#controllers/http/auth_controller')
import { server_grpc } from '../bin/server_grpc.js'
import env from '#start/env'

const API = env.get('API')
switch (API) {
  case 'HTTP':
    router
      .group(() => {
        router.post('/login', [AuthController, 'login'])
        router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
        router
          .get('/me', async ({ auth }: HttpContext) => {
            return auth.use('api').user
          })
          .use(middleware.auth())

        router.resource('/users', UsersController).use('*', middleware.auth())
      })
      .prefix('/api')
    break
  case 'GRPC':
    server_grpc()
    break
  case 'GRAPHQL':
    console.log('bl')
    break
  default:
    exhaustiveCheck(API)
}

function exhaustiveCheck(param: never) {
  console.log('Process the value: ', param)
}
