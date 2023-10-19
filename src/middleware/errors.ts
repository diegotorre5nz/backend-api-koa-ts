// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// eslint-disable-next-line import/no-unused-modules
import config from 'config'
import { InternalServerError, NotFoundError } from '../utils/errors'
import AppError from '../utils/errors/app-error'
const logger = require('@utils/logger')

export async function handleErrors(ctx, next) {
  try {
    return await next()
  } catch (err) {
    let responseError = err
    if (!(err instanceof AppError)) {
      // This should never happen, log appropriately
      logger.error(err)
      responseError = new InternalServerError()
    }
    // Prepare error response
    const isDevelopment = ['local', 'test', 'development'].includes(config.get('env'))
    ctx.status = responseError.status
    ctx.body = {
      type: responseError.type,
      message: responseError.message,
      stack: isDevelopment && responseError.stack,
    }
    return true
  }
}

export function handleNotFound(): AppError {
  throw new NotFoundError()
}
