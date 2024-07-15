#!/usr/bin/env node --experimental-specifier-resolution=node
import * as dotenv from 'dotenv'
import { httpBootstrap } from '../start/httpBootstrap.js'
import { grpcBootstrap } from '../start/grpcBootstrap.js'


dotenv.config()

const API = process.env.API
switch (API) {
  case 'HTTP': {
    httpBootstrap()
    break
  }
  case 'GRAPHQL': {

    break
  }
  case 'GRPC': {
    grpcBootstrap()
    break
  }
  default: {
    throw new Error(`Unsupported API ${API}`)
  }
}
