import vine from '@vinejs/vine'


/**
 * Validates the http lock request
 */
export const httpLockValidator = vine.compile(
  vine.object({
    method: vine.enum(['acquire', 'ensure', 'extend', 'persist', 'poll', 'pollList', 'release']),
  })
)