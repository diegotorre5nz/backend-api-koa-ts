import type { Context } from 'koa'
import compose from 'koa-compose'
import { createUser, Output as createUserOutput } from '../../../operations/v1/users/create'
import { Input as getUserInput } from '../../../operations/v1/users/get'
import { getUser } from '../../../operations/v1/users/get'
import type { Input as CreateUserInput } from '../../../operations/v1/users/create'
import { validate } from '../../middleware/controller-validations'
import * as schema from '../../validations/schemas/v1/users'
import  { userWithTokens, serializedUser } from '../../serializers/user'
import { authenticated } from '../../middleware/authentication'
import { User } from '../../../database/models/user'
import {NotFoundError} from '../../../utils/errors'

export const create = compose([
  validate( schema.create ),
  async (ctx: Context): Promise<void> => {
    const inputData: CreateUserInput = {
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      password: ctx.request.body.password,
      ipAddress: ctx.request.ip,
    }
    
    const operationResult: createUserOutput = await createUser.execute(inputData)
    ctx.created(userWithTokens(operationResult.user, operationResult.accessToken, operationResult.refreshToken))
  },
])

export const me = compose([
  authenticated,
  async (ctx: Context): Promise<void> => {
    const inputData: getUserInput = {
      id: ctx.state.userId,
    }
    
    const existingUser: User | undefined = await getUser.execute(inputData)

    if(!existingUser){
      throw new NotFoundError()
    }
    
    ctx.ok(serializedUser(existingUser))
  },
])