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

    const existingRefreshToken: RefreshTokenModel | undefined = await refreshTokenRepository.findOneBy({ token, userId: tokenVerified.userId , ipAddress })
    
    if (!existingRefreshToken) {
      throw new UnauthorizedError()
    }

    const existingUser: User | undefined = await userRepository.findById(tokenVerified.userId)
    
    if (!existingUser) {
      throw new UnauthorizedError()
    }

    const accessTokenData = newAccessToken(existingUser.id)
    
    return { 
      user: existingUser,
      accessToken: accessTokenData,
    }
   }
}

export const refreshSession = new RefreshSession()