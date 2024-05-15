import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'userlogs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()

      table.string('entity_type').notNullable()
      table.string('entity_id').nullable()
      table.jsonb('entity_id_array').nullable()

      table.string('controller').notNullable()
      table.string('method').notNullable()
      table.jsonb('params').nullable()

      table.boolean('archive').notNullable().defaultTo(false)
      table.integer('user_id').notNullable().references('users.id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
