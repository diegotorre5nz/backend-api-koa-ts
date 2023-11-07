import { UnauthorizedError } from "../../../utils/errors"
import { User } from "../../../database/models/user"
import { Operation } from "../../operation"
import { AccessToken, newAccessToken } from "../../../services/internal/access-tokens"
import { RefreshToken, newRefreshToken } from "../../../services/internal/refresh-tokens"
import { userRepository } from "../../../database/repositories/user"
import { compareHashedStrings } from "../../../utils/crypto"
import { refreshTokenRepository } from "../../../database/repositories/refresh-token"

export type Input = Pick<User, 'email' | 'password'> & Pick<RefreshToken, 'ipAddress'>

export interface Output {
  user: User
  accessToken: AccessToken
  refreshToken: RefreshToken
}

class CreateSession extends Operation<Input, Output> {
   protected async run(requestData: Input): Promise<Output> {
    const { email, password, ipAddress } = requestData

    const existingUser: User | undefined = await userRepository.findByEmail(email)
    
    if (!existingUser) {
      throw new UnauthorizedError()
    }

    const passwordMatched = await compareHashedStrings(password, existingUser.password)
    if (!passwordMatched) {
      throw new UnauthorizedError()
    }

    const refreshTokenData = newRefreshToken(existingUser.id, ipAddress)
    const accessTokenData = newAccessToken({ userId: existingUser.id, refreshToken: refreshTokenData.token })
    const savedRefreshTokenData = await refreshTokenRepository.insert(refreshTokenData)

    return { 
      user: existingUser,
      accessToken: accessTokenData,
      refreshToken: savedRefreshTokenData
    }
   }
}

export const createSession = new CreateSession()
