import vine from '@vinejs/vine'

/**
 * Validates the auth's login action
 */
export const loginAuthValidator = vine.compile(
  vine.object({
    login: vine.string().trim().minLength(2).maxLength(30),
    password: vine.string().trim().escape().minLength(4).maxLength(30),
  })
)
