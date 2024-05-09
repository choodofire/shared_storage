import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { server_grpc } from '../bin/server_grpc.js'
import env from '#start/env'
const UsersController = () => import('#controllers/http/users_controller')
const AuthController = () => import('#controllers/http/auth_controller')
const LocksController = () => import('#controllers/http/locks_controller')
import { exhaustiveCheck } from '#helpers/exhaustive_check'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

const API = env.get('API')

// returns swagger in YAML
router.get('/swagger', async () => AutoSwagger.default.docs(router.toJSON(), swagger))
// Renders Swagger-UI
router.get('/docs', async () => AutoSwagger.default.ui('/swagger', swagger))

switch (API) {
  case 'HTTP':
    router
      .group(() => {
        router.post('/login', [AuthController, 'login'])
        router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
        router.get('/me', [AuthController, 'me']).use(middleware.auth())
        router.resource('/users', UsersController).apiOnly().use('*', middleware.auth())

        router
          .resource('/locks', LocksController)
          .only(['index', 'show', 'store'])
          .use('*', middleware.auth())
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
