import config from 'config'
import {sign, verify, JsonWebTokenError, Jwt, JwtPayload} from 'jsonwebtoken'
import moment from 'moment'

export interface AccessToken {
  userId: number
  token: string,
  expiresAt: Date,
}

export interface AccessTokenPayload {
  userId: number
}

export function generateAccessToken(userId: number): string {
  return sign({
    userId },
   config.get('auth.secret'), 
   { 
    expiresIn: config.get('auth.accessTokenExpiration'), 
    algorithm: config.get('auth.createOptions.algorithm'),
    issuer: config.get('auth.createOptions.issuer')
  })
}

export function verifyAccessToken(accessToken: string): JwtPayload {
  try {
    // Don't return directly for catch block to work properly
    const data: JwtPayload | JsonWebTokenError = verify(accessToken, config.get('auth.secret'), config.get('auth.verifyOptions'))
    return data
  } catch (err) {
    if (err instanceof JsonWebTokenError || err instanceof SyntaxError) {
      throw err
    }
    throw err
  }
}

export const newAccessToken = (userId: number): AccessToken => ({
  userId,
  token: generateAccessToken(userId),
  expiresAt: moment().add(config.get('auth.accessTokenExpiration'), 'milliseconds').toDate(),
})
