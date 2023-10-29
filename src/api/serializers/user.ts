 import moment from 'moment'
 import { User } from '../../database/models/user'
 import { AccessToken } from '../../services/internal/access-tokens'
 import config from 'config'

 export interface UserWithTokens {
  user: User
  authorization: Authorization
 }

 export interface Authorization {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
  refreshToken: string
  refreshTokenExpiresAt: Date
}

 export const userWithTokens = (user: User, accessToken: AccessToken): UserWithTokens => ({
  user,
  authorization: {
    accessToken: accessToken.token,
    accessTokenExpiresAt: accessToken.expiresAt,
    refreshToken: accessToken.token,
    refreshTokenExpiresAt: accessToken.expiresAt,
  }
 })

 