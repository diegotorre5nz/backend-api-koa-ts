import type { Context, Middleware, Next } from 'koa'
import jsonschema from 'jsonschema'
import { ValidationError } from '../utils/errors'
const logger = require('../utils/logger')

export function validate( schema: object): Middleware {
  return async (ctx: Context, next: Next): Promise<Middleware> => {
      const validator = new jsonschema.Validator()
      const inputData = ctx.request.body
      const validationErrors = validator.validate(inputData, schema).errors
      if (validationErrors.length > 0) {
        logger.info(validationErrors)
        throw new ValidationError()
      }
      return next()
    }
}


