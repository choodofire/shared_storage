export interface IAcquireLockRequest {
  ticket: string
  owner: string
  lifetime: number
}

export interface IReleaseLockRequest {
  ticket: string
  owner: string
}

export interface IExtendLockRequest {
  ticket: string
  owner: string
  lifetime: number
}

export interface IPersistLockRequest {
  ticket: string
  owner: string
}

export interface IPollLockRequest {
  ticket: string
  owner: string
}

export interface IPollLockListRequest {
  owner: string
  tickets: string[]
}

export interface IEnsureLockRequest {
  ticket: string
  owner: string
  lifetime: number
}