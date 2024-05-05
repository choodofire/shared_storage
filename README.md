# shared_storage

A standalone redis-based service to provide fast ttl-based data storage over grpc/http/graphQL. It can be used to reset session data and object states, as a kind of cross-service network mutex, and in other scenarios.

## Installation

```bash
nvm use $(cat nodeV)
```
```bash
npm install
```
```bash
proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=app/helpers/protos/generated app/helpers/protos/shared_storage.proto
```

## Running the app

```bash
# prod
$ npm run start
```
```bash
# dev
$ npm run start:dev
```

## Docker

```bash
docker-compose build
```
```bash
docker-compose up
```
