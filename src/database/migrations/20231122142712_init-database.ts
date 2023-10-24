import type { Knex } from 'knex'
import { defaultTo } from 'ramda'

exports.up = async (knex: Knex) => {
  const createIdAndTimestamps = (table: Knex.CreateTableBuilder): void => {
    table.increments('id').primary()
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now())
    table.dateTime('deletedAt').notNullable().defaultTo(knex.fn.now())
  }
  await knex.schema
  // --- users ------------------
  .createTable('users', table => {
    createIdAndTimestamps(table)
    table.string('email', 100).notNullable().unique()
    table.string('password', 100).notNullable()
    table.string('role', 50).notNullable()
  })

  await knex.schema
  // --- refresh_tokens ------------------
  .createTable('refreshTokens', table => {
    createIdAndTimestamps(table)
    table.string('token', 255).notNullable().unique().index()
    table.dateTime('issuedAt').notNullable()
    table.dateTime('expiresAt').notNullable()
    table.dateTime('revokedAt')
    table.string('ipAddress', 255)
    table.integer('userId').notNullable().unsigned()
    table.foreign('userId').references('users.id')
      .onDelete('restrict')
      .onUpdate('restrict')
  })
}

exports.down = (knex: Knex) =>
knex.schema
  .dropTable('refreshTokens')
  .dropTable('users')


