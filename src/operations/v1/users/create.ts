import { ConflictError } from "../../../utils/errors"
import { User } from "../../../database/models/user"
import { userRepository } from "../../../database/repositories/user"
import { Operation } from "../../operation"
import { AccessToken, newAccessToken } from "../../../services/internal/access-tokens"
import { hashPassword } from "../../../utils/crypto"
import { newRefreshToken } from "../../../services/internal/refresh-tokens"

export type Input = Pick<User, 'name' | 'email' | 'password'> 

export interface Output {
  user: User
  accessToken: AccessToken
  refreshToken: AccessToken
}

class CreateUser extends Operation<Input, Output> {
   protected async run(requestData: Input): Promise<Output> {
    const {name, email, password} = requestData
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
    const accessTokenData = newAccessToken(newUser.id)
    const refreshTokenData = newRefreshToken(newUser.id)

    return { 
      user: newUser,
      accessToken: accessTokenData,
      refreshToken: refreshTokenData
    }
   }
}

export const createUser = new CreateUser()