import { type Config, getEnvironmentValue } from '..'

const config: DeepPartial<Config> = {
  hostname: getEnvironmentValue('HOST_NAME', 'http://localhost:3000'),
  database: {
    connection: 'postgres://postgres:postgres@database:5432/backend-api-db',
  },
}

export default config
