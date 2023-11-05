 import moment from 'moment'
 import { User } from '../../database/models/user'
 import { AccessToken } from '../../services/internal/access-tokens'
 import { RefreshToken } from '../../services/internal/refresh-tokens'

 export interface UserWithTokens {
  user: User
  authorization: Authorization
 }

 export interface Authorization {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
  refreshToken: string
  refreshTokenExpiresAt: Date | moment.Moment
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

 