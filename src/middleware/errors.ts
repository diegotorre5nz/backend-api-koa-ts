// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import config from 'config'
import { type Context, type Next } from 'koa'
import { InternalServerError, NotFoundError } from '../utils/errors'
import AppError from '../utils/errors/app-error'
import logger from '../utils/logger'

async function handleErrors(ctx: Context, next: Next): Promise<Boolean | Next> {
  try {
    return await next() as Next
  } catch (err) {
    let responseError = err

    if (!(err instanceof AppError)) {
      // This should never happen, log appropriately
      logger.error(err)
      responseError = new InternalServerError()
    }
    // Prepare error response
    const isDevelopment = ['local', 'test', 'development'].includes(config.get('env'))
    ctx.status = Number(responseError.status)
    ctx.body = {
      type: String(responseError.type),
      message: String(responseError.message),
      stack: isDevelopment ? String(responseError.stack) : '',
    }
    return true
  }
}

function handleNotFound(): AppError {
  throw new NotFoundError()
}

export {
  handleErrors,
  handleNotFound,
}
