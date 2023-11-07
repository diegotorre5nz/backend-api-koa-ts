import type { Context } from 'koa'
import compose from 'koa-compose'
import { createSession, Output as createSessionOutput } from '../../../operations/v1/sessions/create'
import type { Input as CreateSessionInput } from '../../../operations/v1/sessions/create'
import { refreshSession, Output as refreshSessionOutput } from '../../../operations/v1/sessions/refresh'
import type { Input as RefreshSessionInput } from '../../../operations/v1/sessions/refresh'
import { validate } from '../../middleware/controller-validations'
import * as schema from '../../validations/schemas/v1/sessions'
import  { userWithTokens, userWithAccessToken } from '../../serializers/user'

export const create = compose([
  validate( schema.create ),
  async (ctx: Context): Promise<void> => {
    const inputData: CreateSessionInput = {
      email: ctx.request.body.email,
      password: ctx.request.body.password,
      ipAddress: ctx.request.ip,
    }
    
    const operationResult: createSessionOutput = await createSession.execute(inputData)
    ctx.created(userWithTokens(operationResult.user, operationResult.accessToken, operationResult.refreshToken))
  },
])

export const refresh = compose([
  validate( schema.refresh ),
  async (ctx: Context): Promise<void> => {
    const inputData: RefreshSessionInput = {
      token: ctx.request.body.token,
      ipAddress: ctx.request.ip,
    }
    
    const operationResult: refreshSessionOutput = await refreshSession.execute(inputData)
    ctx.created(userWithAccessToken(operationResult.user, operationResult.accessToken))
  },
])
