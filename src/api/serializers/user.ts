 import moment from 'moment'
 import { User } from '../../database/models/user'
 import { AccessToken } from '../../services/internal/access-tokens'
 import { RefreshToken } from '../../services/internal/refresh-tokens'

 export interface UserWithTokens {
  user: User
  authorization: AuthorizationTokens
 }

 export interface AuthorizationTokens {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
  refreshToken: string
  refreshTokenExpiresAt: Date | moment.Moment
}

export interface UserWithAccessToken {
  user: User
  authorization: AuthorizationAccessToken
 }

export interface AuthorizationAccessToken {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
}


export const userWithTokens = (user: User, accessToken: AccessToken, refreshToken: RefreshToken): UserWithTokens => ({
  user,
  authorization: {
    accessToken: accessToken.token,
    accessTokenExpiresAt: accessToken.expiresAt,
    refreshToken: refreshToken.token,
    refreshTokenExpiresAt: refreshToken.expiresAt,
  }
 })

 export const userWithAccessToken = (user: User, accessToken: AccessToken): UserWithAccessToken => ({
  user,
  authorization: {
    accessToken: accessToken.token,
    accessTokenExpiresAt: accessToken.expiresAt,
  }
 })

 