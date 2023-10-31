import type { Context, Middleware, Next } from 'koa'
import jsonschema, {ValidatorResult, ValidationError as JsonValidationError} from 'jsonschema'
import { ValidationError } from '../../utils/errors'

export function validate( schema: any, input?: any): any {
  return async (ctx: Context, next: Next): Promise<Middleware> => {
      const validator = new jsonschema.Validator()
      let inputData: Object = {}
      if(input){
        inputData = Object(input)
      } else {
        inputData = Object(ctx.request.body)
      }
      
      const ValidatorResult: ValidatorResult = validator.validate(inputData, schema)
      const validationErrors: JsonValidationError[] = ValidatorResult.errors
      if (validationErrors.length > 0) {
        throw new ValidationError(validationErrors[0].toString())
      }
      return next()
    }
}


