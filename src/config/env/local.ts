import { type Config } from '..'
import { getEnvironmentValue } from '..'

const config: DeepPartial<Config> = {
  hostname: getEnvironmentValue('HOST_NAME', 'http://localhost:3000'),
  env: 'local',
  database: {
    connection: 'postgres://postgres:postgres@localhost:5432/backend-api-db',
  },
}

export default config
