import vine from '@vinejs/vine'

/**
 * Validates the acquire lock request
 */
export const acquireLockValidator = vine.compile(
  vine.object({
    ticket: vine.string().trim(),
    owner: vine.string().trim(),
    lifetime: vine.number(),
  })
)

/**
 * Validates the ensure lock request
 */
export const ensureLockValidator = vine.compile(
  vine.object({
    ticket: vine.string().trim(),
    owner: vine.string().trim(),
    lifetime: vine.number(),
  })
)

/**
 * Validates the extend lock request
 */
export const extendLockValidator = vine.compile(
  vine.object({
    ticket: vine.string().trim(),
    owner: vine.string().trim(),
    lifetime: vine.number(),
  })
)

/**
 * Validates the persist lock request
 */
export const persistLockValidator = vine.compile(
  vine.object({
    ticket: vine.string().trim(),
    owner: vine.string().trim(),
  })
)

/**
 * Validates the persist lock request
 */
export const pollLockValidator = vine.compile(
  vine.object({
    ticket: vine.string().trim(),
    owner: vine.string().trim(),
  })
)

/**
 * Validates the persist lock request
 */
export const pollLockListValidator = vine.compile(
  vine.object({
    tickets: vine.array(vine.string().trim()),
    owner: vine.string().trim(),
  })
)

/**
 * Validates the release lock request
 */
export const releaseLockValidator = vine.compile(
  vine.object({
    ticket: vine.string().trim(),
    owner: vine.string().trim(),
  })
)
