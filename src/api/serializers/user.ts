 import type * as moment from 'moment'
 import { User } from '../../database/models/user'

 export interface UserWithTokens {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
  refreshToken: string
  refreshTokenExpiresAt: Date
  user: User
 }

 export const userWithTokens = (user: User, accessToken: string, refreshToken: string): UserWithTokens => ({
  accessToken: accessToken,
  accessTokenExpiresAt: new Date(),
  user,
  refreshToken: refreshToken,
  refreshTokenExpiresAt: new Date(),
 })

 