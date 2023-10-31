import R from 'ramda'
import config from 'config'

const staticDatabaseConfig = {
  migrations: {
    directory: '../database/migrations',
  },
  seeds: {
    directory: '../database/seeds',
  },
}
var databaseConfig: Object = R.mergeDeepLeft(Object(config.get('database')), staticDatabaseConfig)

export default { [String(config.get('env'))]: databaseConfig }