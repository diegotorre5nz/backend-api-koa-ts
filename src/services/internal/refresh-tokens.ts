import { UnauthorizedError } from '../../utils/errors'
import config from 'config'
import {sign, verify, JsonWebTokenError, Jwt, JwtPayload} from 'jsonwebtoken'
import moment from 'moment'

export interface RefreshToken {
  token: string,
  issuedAt: Date
  expiresAt: Date | moment.Moment,
  ipAddress: string,
  userId: number,
}

export interface RefreshTokenPayload {
  ipAddress: string,
  userId: number,
}

// TODO: ADD IP ADDRESS TO generateRefreshToken
export function generateRefreshToken(userId: number, ipAddress: string): string {
  
  return sign({
      userId,
      ipAddress 
    },
    config.get('auth.secret'), 
     { 
      expiresIn: config.get('auth.refreshTokenExpiration'), 
      algorithm: config.get('auth.createOptions.algorithm'),
      issuer: config.get('auth.createOptions.issuer')
    })
}

export function verifyRefreshToken(accessToken: string): JwtPayload {
  try {
    // Don't return directly for catch block to work properly
    const data: JwtPayload = verify(accessToken, config.get('auth.secret'), config.get('auth.verifyOptions'))
    return data
  } catch (err) {
    if (err instanceof JsonWebTokenError || err instanceof SyntaxError) {
      throw new UnauthorizedError(err.message)
    }
    throw new UnauthorizedError()
  }
}

export const newRefreshToken = (userId: number, ipAddress: string): RefreshToken => ({
  userId,
  ipAddress,
  token: generateRefreshToken(userId, ipAddress),
  issuedAt: moment().toDate(),
  expiresAt: moment().add(config.get('auth.refreshTokenExpiration'), 'milliseconds').toDate(),
})