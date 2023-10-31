import type { Context } from 'koa'
import compose from 'koa-compose'
import { createUser, Output as createUserOutput } from '../../../operations/v1/users/create'
import { Input as getUserInput } from '../../../operations/v1/users/get'
import { getUser, Output as getUserOutput } from '../../../operations/v1/users/get'
import type { Input as CreateUserInput } from '../../../operations/v1/users/create'
import { validate } from '../../middleware/controller-validations'
import * as schema from '../../validations/schemas/v1/users'
import  { userWithTokens } from '../../serializers/user'
import {authenticate} from '../../middleware/authentication'
import { User } from '../../../database/models/user'
import {NotFoundError} from '../../../utils/errors'
import { AccessToken } from '../../../services/internal/access-tokens'
import { RefreshToken } from '../../../services/internal/refresh-tokens'
import moment from 'moment'

export const create = compose([
  validate( schema.create ),
  async (ctx: Context): Promise<void> => {
    const inputData: CreateUserInput = {
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      password: ctx.request.body.password,
    }
    
    const operationResult: createUserOutput = await createUser.execute(inputData)
    ctx.created(userWithTokens(operationResult.user, operationResult.accessToken, operationResult.refreshToken))
  },
])

export const me = compose([
  authenticate,
  async (ctx: Context): Promise<void> => {
    const inputData: getUserInput = {
      id: ctx.state.userId,
    }
    
    const operationResult: User | undefined = await getUser.execute(inputData)
    console.log(operationResult)
    const accessToken: AccessToken = {
      token: 'string',
      expiresAt: moment().toDate(),
    }
    const refreshToken: RefreshToken = {
      token: 'string',
      expiresAt: moment().toDate(),
    }
    if(!operationResult){
      throw new NotFoundError()
    }
  
    ctx.created(userWithTokens(operationResult, accessToken, refreshToken))
  },
])