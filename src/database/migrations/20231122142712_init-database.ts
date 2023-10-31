import type { Knex } from 'knex'
import { defaultTo } from 'ramda'

exports.up = async (knex: Knex) => {
  const createIdAndTimestamps = (table: Knex.CreateTableBuilder): void => {
    table.increments('id').primary()
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now())
    table.dateTime('deleted_at')
  }
  await knex.schema
  // --- users ------------------
  .createTable('users', table => {
    createIdAndTimestamps(table)
    table.string('name', 50).notNullable()
    table.string('email', 100).notNullable().unique()
    table.string('password', 100).notNullable()
  })

  await knex.schema
  // --- refresh_tokens ------------------
  .createTable('refresh_tokens', table => {
    createIdAndTimestamps(table)
    table.string('token', 255).notNullable().unique().index()
    table.dateTime('issued_at').notNullable()
    table.dateTime('expires_at').notNullable()
    table.dateTime('revoked_at')
    table.string('ip_address', 255)
    table.integer('user_id').notNullable().unsigned()
    table.foreign('user_id').references('users.id')
      .onDelete('restrict')
      .onUpdate('restrict')
  })
}

exports.down = (knex: Knex) =>
knex.schema
  .dropTable('refreshTokens')
  .dropTable('users')


