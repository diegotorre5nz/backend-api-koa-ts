import pino from 'pino'
import config from 'config'
import { getEnvironmentValue } from '../config'

const logger = pino({
  name: getEnvironmentValue('npm_package_name', 'backend-api-koa-ts'),
  level: config.get('logger.minLevel'),
  enabled: config.get('logger.enabled'),
})

export default logger
