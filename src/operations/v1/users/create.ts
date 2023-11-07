import { ConflictError } from "../../../utils/errors"
import { User } from "../../../database/models/user"
import { userRepository } from "../../../database/repositories/user"
import { Operation } from "../../operation"
import { AccessToken, newAccessToken } from "../../../services/internal/access-tokens"
import { RefreshToken, newRefreshToken } from "../../../services/internal/refresh-tokens"

export type Input = Pick<User, 'name' | 'email' | 'password'> & Pick<RefreshToken, 'ipAddress'>

export interface Output {
  user: User
  accessToken: AccessToken
  refreshToken: RefreshToken
}

class CreateUser extends Operation<Input, Output> {
   protected async run(requestData: Input): Promise<Output> {
    const {name, email, password, ipAddress} = requestData
    const existingUser: User | undefined = await userRepository.findByEmail(email)
    
    if (existingUser) {
      throw new ConflictError('User already exists.')
    }

    const userData = {
      name,
      email,
      password,
    }
    
    const newUser: User = await userRepository.insert(userData)
    const refreshTokenData = newRefreshToken(newUser.id, ipAddress)
    const accessTokenData = newAccessToken({ userId: newUser.id, refreshToken:  refreshTokenData.token })
    
    return { 
      user: newUser,
      accessToken: accessTokenData,
      refreshToken: refreshTokenData
    }
   }
}

export const createUser = new CreateUser()