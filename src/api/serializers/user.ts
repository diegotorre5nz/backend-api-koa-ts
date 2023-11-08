 import moment from 'moment'
 import { User } from '../../database/models/user'
 import { AccessToken } from '../../services/internal/access-tokens'
 import { RefreshToken } from '../../services/internal/refresh-tokens'

 export interface SerializedUser {
  id: number,
  name: string,
  email: string,
  createdAt: Date,
  updatedAt: Date,
 }

 export interface UserWithTokens {
  id: number,
  name: string,
  email: string,
  createdAt: Date,
  updatedAt: Date,
  authorization: AuthorizationTokens
 }

 export interface AuthorizationTokens {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
  refreshToken: string
  refreshTokenExpiresAt: Date | moment.Moment
}

export interface UserWithAccessToken {
  id: number,
  name: string,
  email: string,
  createdAt: Date,
  updatedAt: Date,
  authorization: AuthorizationAccessToken
 }

export interface AuthorizationAccessToken {
  accessToken: string
  accessTokenExpiresAt: Date | moment.Moment
}

 export const serializedUser = (userInput: User): SerializedUser => ({
  id: userInput.id,
  name: userInput.name,
  email: userInput.email,
  createdAt: userInput.createdAt,
  updatedAt: userInput.updatedAt,
 })

export const userWithTokens = (userInput: User, accessToken: AccessToken, refreshToken: RefreshToken): UserWithTokens => ({
  id: userInput.id,
  name: userInput.name,
  email: userInput.email,
  createdAt: userInput.createdAt,
  updatedAt: userInput.updatedAt,
  authorization: {
    accessToken: accessToken.token,
    accessTokenExpiresAt: accessToken.expiresAt,
    refreshToken: refreshToken.token,
    refreshTokenExpiresAt: refreshToken.expiresAt,
  }
 })

 export const userWithAccessToken = (userInput: User, accessToken: AccessToken): UserWithAccessToken => ({
  id: userInput.id,
  name: userInput.name,
  email: userInput.email,
  createdAt: userInput.createdAt,
  updatedAt: userInput.updatedAt,
  authorization: {
    accessToken: accessToken.token,
    accessTokenExpiresAt: accessToken.expiresAt,
  }
 })

 