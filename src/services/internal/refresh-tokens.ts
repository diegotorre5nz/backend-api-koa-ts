import config from 'config'
import {sign, verify, JsonWebTokenError, Jwt} from 'jsonwebtoken'
import moment from 'moment'

export interface RefreshToken {
  userId: number,
  ipAddress: string,
  token: string,
  expiresAt: Date | moment.Moment,
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

export function verifyRefreshToken(accessToken: string): Jwt | null {
  try { // TODO ADD REFRESH TOKEN
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

export const newRefreshToken = (userId: number, ipAddress: string): RefreshToken => ({
  userId,
  ipAddress,
  token: generateRefreshToken(userId, ipAddress),
  expiresAt: moment().add(config.get('auth.refreshTokenExpiration'), 'milliseconds').toDate(),
})