# shared_storage

A standalone redis-based service to provide fast ttl-based data storage over grpc. It can be used to reset session data and object states, as a kind of cross-service network mutex, and in other scenarios.

## Installation

```bash
# set correct Node
$ nvm use $(cat nodeV)

# install
$ npm install
```

## Running the app

```bash
# start
$ npm run start

# development
$ npm run start:dev
```

## docker
```bash
# build app
$ docker-compose build

# run app
$ docker-compose up

# run redis only
$ docker-compose -f docker-compose-storage-only.yml up
```

## Tests

Tests should be run after the main service has started.

```bash
# start
$ npm run test
```

 ## gRPC API

"LockRequest" - represents an object with all fields passed in when the lock is set.

| Method       | Request                                                     | Response                                                                                              | Description                                                                                                                                                                                           |
|--------------|-------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AcquireLock  | owner:string<br/>ticket:string<br/>lifetime:int             | isError:bool<br/>lock:LockRequest<br/>timeSpent:int<br/>message:string                                | Locking by key "ticket" for a specified time "lifetime". You can unlock an entry or extend the lock only with a matching owner. When the "lifetime" expires, the record is deleted from the database. |
| ReleaseLock  | owner:string<br/>ticket:string<br/>?lifetime:int            | isError:bool<br/>lock:LockRequest<br/>timeSpent:int<br/>message:string                                | Unlocks the record if the "owner" fields match.                                                                                                                                                       |
| ExtendLock   | owner:string<br/>ticket:string<br/>lifetime:int             | isError:bool<br/>lock:LockRequest<br/>timeSpent:int<br/>message:string                                | Extending the life time of a blocked. "lifetime" in milliseconds. Only if the owner fields match.                                                                                                     |
| PersistLock  | owner:string<br/>ticket:string<br/>?lifetime:int            | isError:bool<br/>lock:LockRequest<br/>timeSpent:int<br/>message:string                                | An alternative to AcquireLock with no lifetime. Lock forever.                                                                                                                                         |
| PollLock     | owner:string<br/>ticket:string<br/>lifetime:int             | isBlocked:bool<br/>isError:bool<br/>lock:LockRequest<br/>timeSpent:int                                | Check whether the record is blocked by the transmitted "ticket". Only if the owner fields match.                                                                                                      |
| PollLockList | [<br/>owner:string<br/>ticket:string<br/>lifetime:int<br/>] | isBlocked:bool<br/>[<br/>isBlocked:bool<br/>isError:bool<br/>lock:LockRequest<br/>timeSpent:int<br/>] | PollLock, but you can check an array of records. isBlocked = true if all are unlocked.                                                                                                                |
| EnsureLock   | owner:string<br/>ticket:string<br/>lifetime:int             | isError:bool<br/>lock:LockRequest<br/>timeSpent:int<br/>message:string                                | Combining AcquireLock and ExtendLock. If the record is not locked, it will be locked. If it is already locked, the lock time will change.                                                             |