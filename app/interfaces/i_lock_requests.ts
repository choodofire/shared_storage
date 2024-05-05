// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IAcquireLockRequest {
  ticket: string
  owner: string
  lifetime: number
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IReleaseLockRequest {
  ticket: string
  owner: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IExtendLockRequest {
  ticket: string
  owner: string
  lifetime: number
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IPersistLockRequest {
  ticket: string
  owner: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IPollLockRequest {
  ticket: string
  owner: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IPollLockListRequest {
  owner: string
  tickets: string[]
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IEnsureLockRequest {
  ticket: string
  owner: string
  lifetime: number
}
