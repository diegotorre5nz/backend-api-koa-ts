import type * as moment from 'moment'

export interface Authorization {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
  refreshToken: string
  refreshTokenExpiresAt: Date | moment.Moment
}