import path from 'path'
import * as protoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import type { ProtoGrpcType } from '../protos/generated/shared_storage'
import { DateTime } from 'luxon'
import { ReflectionService } from '@grpc/reflection'
import { normalizePort } from './utils'
import GrpcController from '../controllers/grpcController'
import { LockServiceHandlers } from '../protos/generated/lockService/LockService'


export function grpcBootstrap() {
  
  const HOST = process.env.HOST
  const PORT = normalizePort(process.env.PORT)
  if (!PORT) throw Error(`Unavailable PORT: ${process.env.PORT}`)

  const PROTO_PATH = path.resolve('./src/protos/shared_storage.proto')
  
  const packageDefinition = protoLoader.loadSync(PROTO_PATH)
  const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType
  
  const reflection = new ReflectionService(packageDefinition)
  const server = new grpc.Server()
  reflection.addToServer(server)
  
  const grpcHandlers = new GrpcController() as unknown as LockServiceHandlers
  server.addService(proto.lockService.LockService.service, grpcHandlers)
  
  server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(`Failed to start gRPC server: ${err}`)
      return
    }
    
    console.info(`[${DateTime.now().toISOTime()}] INFO: started GRPC server on ${HOST}:${port}`)
  })
}