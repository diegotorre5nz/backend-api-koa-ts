import type { Context, Middleware, Next } from 'koa'
import jsonschema, {Validator, ValidatorResult, ValidationError as JsonValidationError} from 'jsonschema'
import { ValidationError } from '../utils/errors'
const logger = require('../utils/logger')

export function validate( schema: any): Middleware {
  return async (ctx: Context, next: Next): Promise<Middleware> => {
      const validator: Validator = new jsonschema.Validator()
      const inputData: Object = ctx.request.body
      const ValidatorResult: ValidatorResult = validator.validate(inputData, schema)
      const validationErrors: JsonValidationError[] = ValidatorResult.errors
      if (validationErrors.length > 0) {
        throw new ValidationError(validationErrors[0].toString())
      }
      return next()
    }
}


