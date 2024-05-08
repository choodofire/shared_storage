import vine from '@vinejs/vine'

/**
 * Validates the http lock request
 */
export const httpLockValidator = vine.compile(
  vine.object({
    method: vine.enum(['Acquire', 'Ensure', 'Extend', 'Persist', 'Poll', 'PollList', 'Release']),
  })
)
