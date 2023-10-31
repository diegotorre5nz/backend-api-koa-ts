import { Context, Next } from 'koa'
import { validate } from '../middleware/controller-validations'
import * as schema from '../validations/schemas/v1/users'
import { UnauthorizedError } from '../../utils/errors'
import logger from '../../utils/logger'
import { verifyAccessToken } from '../../services/internal/access-tokens'
import { verify, Jwt } from 'jsonwebtoken'
import config from 'config'

interface Payload {
  loginTimeout: number,
  user: number,
}

interface JwtToken extends Jwt {
  userId: number,
  iat: number,
  exp: number,
  iss: string
}

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
  const data: Jwt  = await verifyTokenPayload(input)
  return data
}

export async function authenticate(ctx: Context, next: Next) {
  if (!ctx) {
    throw new Error('Context has to be defined')
  }
  const data: JwtToken | null = await getAuthPayload(ctx.header.authorization) as JwtToken
  if (!data) {
    throw new UnauthorizedError()
  }
  ctx.state.userId = data.userId // TODO Get the full user object
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

async function verifyTokenPayload(input: any): Promise<Jwt> {
  logger.info({ input }, 'verifyTokenPayload')
  try {
    var decoded = verify(input.jwtToken, config.get('auth.secret'))
    const jwtPayload: Jwt | null = await verifyAccessToken(input.jwtToken)
    if(!jwtPayload){
      throw new UnauthorizedError()
    }
    console.log(jwtPayload)
    //const userId = parseInt(jwtPayload.userId)
    return jwtPayload
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
  authenticate,
}