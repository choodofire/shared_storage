import vine from '@vinejs/vine'

const Roles = [1, 2, 3] as const

/**
 * Validates the user's creation action
 */
export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().escape().minLength(4).maxLength(30),
    role: vine.enum(Roles),
  })
)

/**
 * Validates the user's updating action
 */
export const updateUserValidator = vine.compile(
  vine.object({
    id: vine.number(),
    password: vine.string().trim().escape().minLength(4).maxLength(30).optional(),
    role: vine.enum(Roles).optional(),
    active: vine.boolean().optional(),
  })
)

/**
 * Validates the user's id
 */
export const idUserValidator = vine.compile(
  vine.object({
    id: vine.number(),
  })
)
