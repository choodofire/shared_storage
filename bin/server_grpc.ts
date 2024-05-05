import path from 'node:path'
import * as protoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import wrapServerWithReflection from 'grpc-node-server-reflection'
import type { ProtoGrpcType } from '#helpers/protos/generated/shared_storage'
import { LockServiceHandlers } from '#helpers/protos/generated/lockService/LockService'
import env from '#start/env'
import { DateTime } from 'luxon'
import LockController from '#controllers/grpc/lock_controller'
import RedisService from '#services/redis_service'
import LockService from '#services/lock_service'

export function server_grpc() {
  const HOST = env.get('HOST')
  const PORT = env.get('GRPC_PORT', 50051)
  const PROTO_PATH = path.resolve('./app/helpers/protos/shared_storage.proto')

  const packageDefinition = protoLoader.loadSync(PROTO_PATH)
  const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType

  const wrapServerWithReflectionF = wrapServerWithReflection.default
  const server = wrapServerWithReflectionF(new grpc.Server())
  const grpcHandlers = new LockController(
    new LockService(new RedisService())
  ) as unknown as LockServiceHandlers

  server.addService(proto.lockService.LockService.service, grpcHandlers)

  server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(`Failed to start gRPC server: ${err}`)
      return
    }

    console.info(`[${DateTime.now().toISOTime()}] INFO: started GRPC server on ${HOST}:${port}`)
  })
}
