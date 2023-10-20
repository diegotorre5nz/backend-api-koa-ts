import { type Config } from '..'

const config: DeepPartial<Config> = {
  hostname: 'http://localhost:3000',
  logger: {
    enabled: false,
    stdout: true,
    minLevel: 'error',
  },
  database: {
    connection:
      'postgres://postgres:postgres@database:5432/backend-api-db-test',
  },
}

export default config
