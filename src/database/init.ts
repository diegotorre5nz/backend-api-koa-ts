import objection from 'objection'
// -- Knex/PG issue: https://github.com/tgriesser/knex/issues/927
import pg from 'pg'

pg.types.setTypeParser(20, 'text', parseInt)
pg.types.setTypeParser(1700, 'text', parseFloat)
// -- end --
import knexLib from 'knex'
import R from 'ramda'
import config from 'config'
import logger from '../utils/logger'
import knexConfig from '../config/knexfile'
const knexEnvConfig = knexConfig[String(config.get('env'))]
const knexConfigMerged: Object = R.mergeDeepWith(Object({}), knexEnvConfig, objection.knexSnakeCaseMappers())
const knex = knexLib(Object(knexConfigMerged))
const Model = objection.Model
Model.knex(knex)
const transaction = objection.transaction

function connect() {
  // Knex does not have an explicit `.connect()` method so we issue a query and consider the
  // connection to be open once we get the response back.
  logger.info('✅ Database connection Initialized...')
  return knex.raw('select 1 + 1')
}

function close() {
  logger.info('🛑 Database connection Closed...')
  return knex.destroy()
}

export {
  Model,
  knex,
  transaction,
  connect,
  close,
}