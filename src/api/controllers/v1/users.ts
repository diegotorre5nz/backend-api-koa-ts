import type { Context } from 'koa'
import compose from 'koa-compose'
import { createUser, Output as createUserOutput } from '../../../operations/v1/users/create'
import type { Input as CreateUserInput } from '../../../operations/v1/users/create'
import { validate } from '../../../middleware/controller-validations'
import * as schema from '../../validations/schemas/v1/users'
import  { userWithTokens } from '../../serializers/user'

export const create = compose([
  validate({ body: schema.create }),
  async (ctx: Context): Promise<void> => {
    const inputData: CreateUserInput = {
      email: ctx.request.body.email,
      password: ctx.request.body.password,
    }
    const operationResult: createUserOutput = await createUser.execute(inputData)
    ctx.created(userWithTokens(operationResult.user, 'accessToken-fake', 'refreshToken-kake'))
  },
])