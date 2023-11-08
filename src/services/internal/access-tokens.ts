import { refreshTokenRepository } from '../../database/repositories/refresh-token'
import { RefreshToken as RefreshTokenModel } from "../../database/models/refresh-token"
import config from 'config'
import {sign, verify, JsonWebTokenError, JwtPayload} from 'jsonwebtoken'
import { UnauthorizedError } from '../../utils/errors'
import moment from 'moment'

export interface AccessToken {
  userId: number,
  token: string,
  expiresAt: Date,
}

export interface AccessTokenPayload {
  userId: number,
  refreshToken: string
}

export function generateAccessToken(payload: AccessTokenPayload): string {
  return sign(payload,
   config.get('auth.secret'), 
   { 
    expiresIn: config.get('auth.accessTokenExpiration'), 
    algorithm: config.get('auth.createOptions.algorithm'),
    issuer: config.get('auth.createOptions.issuer')
  })
}

export async function verifyAccessToken(accessToken: string): Promise<JwtPayload> {
  try {
    // Don't return directly for catch block to work properly
    const data: JwtPayload | JsonWebTokenError = verify(accessToken, config.get('auth.secret'), config.get('auth.verifyOptions'))
    const accessTokenPayload = data as AccessTokenPayload
    
    const existingRefreshToken: RefreshTokenModel | undefined = await refreshTokenRepository.findValidTokenAndUserByTokenAndUser(accessTokenPayload.refreshToken, accessTokenPayload.userId)

    // RefreshToken or User doesn't exists in the db
    if (!existingRefreshToken) {
      throw new UnauthorizedError('Refresh Token revoked.')
    }
    return data
  } catch (err) {
    if (err instanceof JsonWebTokenError || err instanceof SyntaxError) {
      throw err
    }
    throw err
  }
}

export const newAccessToken = (payload: AccessTokenPayload): AccessToken => ({
  userId: payload.userId,
  token: generateAccessToken(payload),
  expiresAt: moment().add(config.get('auth.accessTokenExpiration'), 'milliseconds').toDate(),
})
