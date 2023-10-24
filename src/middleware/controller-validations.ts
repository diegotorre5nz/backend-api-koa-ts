import type { Context, Middleware, Next } from 'koa'
import jsonschema, {ValidatorResult, ValidationError as JsonValidationError} from 'jsonschema'
import { ValidationError } from '../utils/errors'
import { JSONSchema, JsonObjectOrFieldExpression } from 'objection'
const logger = require('../utils/logger')

export function validate( schema: any): Middleware {
  return async (ctx: Context, next: Next): Promise<Middleware> => {
      const validator = new jsonschema.Validator()
      const inputData = ctx.request.body
      const ValidatorResult = validator.validate(inputData, schema)
      const validationErrors: JsonValidationError[] = ValidatorResult.errors
      if (validationErrors.length > 0) {
        throw new ValidationError(validationErrors[0].toString())
      }
      return next()
    }
}


