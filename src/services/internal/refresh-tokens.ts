import config from 'config'
import {sign, verify, JsonWebTokenError} from 'jsonwebtoken'
import moment from 'moment'

export interface RefrshToken {
  token: string,
  expiresAt: Date,
}

export function generateRefreshToken(userId: number) {
  return sign({ userId }, config.get('auth.secret'), config.get('auth.createOptions'))
}

export function verifyRefreshToken(accessToken: string) {
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

export const newRefreshToken = (userId: number): RefrshToken => ({
  token: generateRefreshToken(userId),
  expiresAt: moment().add(config.get('auth.createOptions.expiresIn'), 'seconds').toDate(),
})