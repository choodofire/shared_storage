import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'admin@admin.com',
        password: 'test',
        role: 1,
      },
      {
        email: 'user@user.com',
        password: 'test',
        role: 2,
      },
    ])
  }
}
