import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Userlog extends BaseModel {
  static table = 'userlogs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare entityType: string

  @column()
  declare entityId: string | null

  @column()
  declare entityIdArray: string[] | null

  @column()
  declare controller: string

  @column()
  declare method: string

  @column()
  declare params: object | null

  @column()
  declare archive: boolean

  @column()
  declare userId: number

  @column()
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: relations.BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
