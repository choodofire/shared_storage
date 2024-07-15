import httpApp  from '../controllers/httpController'
import http from 'http'
import debug from 'debug'
import { normalizePort } from './utils'


export function httpBootstrap() {
  const port = normalizePort(process.env.PORT)
  httpApp.set('port', port)
  httpApp.set('hostname', process.env.HOSTNAME)

  const server = http.createServer(httpApp)

  server.listen(port, () => {
    console.log(`Server started on host: ${process.env.HOST}:${port}`)
  })
  server.on('error', onError)
  server.on('listening', onListening)

  function onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1)
        break
      default:
        throw error
    }
  }

  function onListening() {
    const addr = server.address()
    if (!addr) throw new Error('No addr')

    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    debug('Listening on ' + bind)
  }
}
