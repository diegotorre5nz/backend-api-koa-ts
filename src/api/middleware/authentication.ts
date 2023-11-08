import { Context, Next } from 'koa'
import { validate } from '../middleware/controller-validations'
import * as schema from '../validations/schemas/v1/users'
import { UnauthorizedError } from '../../utils/errors'
import logger from '../../utils/logger'
import { AccessToken, AccessTokenPayload, verifyAccessToken } from '../../services/internal/access-tokens'
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'

async function getAuthPayload(authorization: any): Promise<AccessTokenPayload> {
  const parsedHeader = parseHeader(authorization)
  if (!parsedHeader
    || !parsedHeader.value
    || !parsedHeader.scheme
    || parsedHeader.scheme.toLowerCase() !== 'jwt'
  ) {
    throw new UnauthorizedError('No credentials were provided')
  }
  const input = { jwtToken: parsedHeader.value }
  validate(schema.jwtToken, input)
  const data: AccessTokenPayload  = await verifyTokenPayload(input)
  return data
}

export async function authenticated(ctx: Context, next: Next) {
  if (!ctx) {
    throw new Error('Context has to be defined')
  }
  const data: JwtPayload | null = await getAuthPayload(ctx.header.authorization) as JwtPayload
  const refreshTokenData = data as AccessToken
  if (!refreshTokenData) {
    throw new UnauthorizedError()
  }

  ctx.state.userId = refreshTokenData.userId
  return next()
}

function parseHeader(hdrValue: any) {
  if (!hdrValue || typeof hdrValue !== 'string') {
    return null
  }
  const matches = hdrValue.match(/(\S+)\s+(\S+)/u)
  return matches && {
    scheme: matches[1],
    value: matches[2],
  }
}

async function verifyTokenPayload(input: any): Promise<AccessTokenPayload> {
  logger.info({ input }, 'verifyTokenPayload')
  try {
    const jwtPayload: JwtPayload | JsonWebTokenError = await verifyAccessToken(input.jwtToken)
    const accessTokenPayload = jwtPayload as AccessTokenPayload
    if(!jwtPayload){
      throw new UnauthorizedError()
    }
    return accessTokenPayload
  } catch(err: any) {
    throw new UnauthorizedError(JSON.stringify(err))
  }
  
}

module.exports = {
  getAuthPayload,
  authenticated,
}