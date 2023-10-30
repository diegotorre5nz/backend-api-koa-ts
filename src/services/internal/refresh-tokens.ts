import config from 'config'
import {sign, verify, JsonWebTokenError, Jwt} from 'jsonwebtoken'
import moment from 'moment'

export interface RefreshToken {
  token: string,
  expiresAt: Date,
}

export function generateRefreshToken(userId: number): string {
  return sign({
      userId },
     config.get('auth.secret'), 
     { 
      expiresIn: config.get('auth.refreshTokenExpiration'), 
      algorithm: config.get('auth.createOptions.algorithm'),
      issuer: config.get('auth.createOptions.issuer')
    })
}

export function verifyRefreshToken(accessToken: string): Jwt | null {
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

export const newRefreshToken = (userId: number): RefreshToken => ({
  token: generateRefreshToken(userId),
  expiresAt: moment().add(config.get('auth.refreshTokenExpiration'), 'milliseconds').toDate(),
})