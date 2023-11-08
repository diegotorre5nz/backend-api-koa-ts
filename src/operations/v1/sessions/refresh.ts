import { UnauthorizedError } from "../../../utils/errors"
import { RefreshToken as RefreshTokenModel } from "../../../database/models/refresh-token"
import { User } from "../../../database/models/user"
import { Operation } from "../../operation"
import { AccessToken, newAccessToken } from "../../../services/internal/access-tokens"
import { RefreshToken, newRefreshToken, verifyRefreshToken, RefreshTokenPayload } from "../../../services/internal/refresh-tokens"
import { userRepository } from "../../../database/repositories/user"
import { refreshTokenRepository } from "../../../database/repositories/refresh-token"
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken"

export type Input = Pick<RefreshToken, 'token' | 'ipAddress'>

export interface Output {
  user: User
  accessToken: AccessToken
}

class RefreshSession extends Operation<Input, Output> {
   protected async run(requestData: Input): Promise<Output> {
    const { token, ipAddress } = requestData

    const jwtVerified: JwtPayload = verifyRefreshToken(token)

    const tokenVerified = jwtVerified as RefreshTokenPayload

    const existingRefreshToken: RefreshTokenModel | undefined = await refreshTokenRepository.findValidTokenAndUserByToken(token)
    
    // RefreshToken or User doesn't exists in the db
    if (!existingRefreshToken) {
      throw new UnauthorizedError()
    }
    
    // Token exists in the db but it doenst match the userId and ipAddress
    if (!(existingRefreshToken.userId == tokenVerified.userId) || !(existingRefreshToken.ipAddress == ipAddress) ) {
      // Token is revoked and deleted, so all it's derived AccessTokens will be desabled as well
      await refreshTokenRepository.patchById(existingRefreshToken.id,{revokedAt: new Date(), deletedAt: new Date()})
      throw new UnauthorizedError()
    }

    const existingUser: User | undefined = await userRepository.findById(tokenVerified.userId)
    
    if (!existingRefreshToken.user) {
      throw new UnauthorizedError()
    }

    const accessTokenData = newAccessToken( { 
      userId: existingRefreshToken.userId, 
      refreshToken: existingRefreshToken.token
    })
    
    return { 
      user: existingRefreshToken.user,
      accessToken: accessTokenData,
    }
   }
}

export const refreshSession = new RefreshSession()