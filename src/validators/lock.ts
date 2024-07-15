import vine from '@vinejs/vine'


const ticketRules = () => vine.string().trim().uuid()
const ownerRules = () => vine.string().trim()
const lifetimeRules = () => vine.number()

/**
 * Validates the acquire lock request
 */
export const acquireLockValidator = vine.compile(
  vine.object({
    ticket: ticketRules(),
    owner: ownerRules(),
    lifetime: lifetimeRules(),
  })
)

/**
 * Validates the ensure lock request
 */
export const ensureLockValidator = vine.compile(
  vine.object({
    ticket: ticketRules(),
    owner: ownerRules(),
    lifetime: lifetimeRules(),
  })
)

/**
 * Validates the extend lock request
 */
export const extendLockValidator = vine.compile(
  vine.object({
    ticket: ticketRules(),
    owner: ownerRules(),
    lifetime: lifetimeRules(),
  })
)

/**
 * Validates the persist lock request
 */
export const persistLockValidator = vine.compile(
  vine.object({
    ticket: ticketRules(),
    owner: ownerRules(),
  })
)

/**
 * Validates the persist lock request
 */
export const pollLockValidator = vine.compile(
  vine.object({
    ticket: ticketRules(),
    owner: ownerRules(),
  })
)

/**
 * Validates the persist lock request
 */
export const pollLockListValidator = vine.compile(
  vine.object({
    tickets: vine.array(ticketRules()),
    owner: ownerRules(),
  })
)

/**
 * Validates the release lock request
 */
export const releaseLockValidator = vine.compile(
  vine.object({
    ticket: ticketRules(),
    owner: ownerRules(),
  })
)