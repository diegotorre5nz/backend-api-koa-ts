import config from 'config'
import {sign, verify, JsonWebTokenError, Jwt} from 'jsonwebtoken'
import moment from 'moment'

export interface AccessToken {
  userId: number
  token: string,
  expiresAt: Date,
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

export function verifyAccessToken(accessToken: string): Jwt | null {
  try {
    // Don't return directly for catch block to work properly
    const data = verify(accessToken, config.get('auth.secret'), config.get('auth.verifyOptions'))
    return data
  } catch (err) {
    if (err instanceof JsonWebTokenError || err instanceof SyntaxError) {
      return null
    }
    throw err
  }
}

export const newAccessToken = (userId: number): AccessToken => ({
  userId,
  token: generateAccessToken(userId),
  expiresAt: moment().add(config.get('auth.accessTokenExpiration'), 'milliseconds').toDate(),
})
