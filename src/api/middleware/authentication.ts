import { Context, Next } from 'koa'
import { validate } from '../middleware/controller-validations'
import * as schema from '../validations/schemas/v1/users'
import { UnauthorizedError } from '../../utils/errors'
import logger from '../../utils/logger'
import { AccessToken, verifyAccessToken } from '../../services/internal/access-tokens'
import { verify, Jwt, JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import config from 'config'

async function getAuthPayload(authorization: any) {
  const parsedHeader = parseHeader(authorization)
  if (!parsedHeader
    || !parsedHeader.value
    || !parsedHeader.scheme
    || parsedHeader.scheme.toLowerCase() !== 'jwt'
  ) {
    return null
  }
  const input = { jwtToken: parsedHeader.value }
  validate(schema.jwtToken, input)
  const data: AccessToken  = await verifyTokenPayload(input)
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

async function verifyTokenPayload(input: any): Promise<AccessToken> {
  logger.info({ input }, 'verifyTokenPayload')
  try {
    var decoded = verify(input.jwtToken, config.get('auth.secret'))
    const jwtPayload: JwtPayload | JsonWebTokenError = await verifyAccessToken(input.jwtToken)
    const accessTokenPayload = jwtPayload as AccessToken
    if(!jwtPayload){
      throw new UnauthorizedError()
    }
    console.log(accessTokenPayload)
    //const userId = parseInt(jwtPayload.userId)
    return accessTokenPayload
  } catch(err: any) {
    throw new UnauthorizedError(JSON.stringify(err))
  }

  //const now = Date.now()
  // if (!jwtPayload || !jwtPayload. || now >= jwtPayload.exp * 1000) {
  //   throw new UnauthorizedError()
  // }

  
  // const user = userRepository.findById(userId)
  // if (!user || user.disabled) {
  //   throw new UnauthorizedError()
  // }
  // logger.info('verifyTokenPayload')
  // return {
  //   user,
  //   loginTimeout: jwtPayload.exp * 1000,
  // }
}

module.exports = {
  getAuthPayload,
  authenticated,
}