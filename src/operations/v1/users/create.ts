import { ConflictError } from "../../../utils/errors"
import { User } from "../../../database/models/user"
import { userRepository } from "../../../database/repositories/user"
import { Operation } from "../../operation"
export type Input = Pick<User, 'email' | 'password'> 

export interface Output {
  user: User
}

class CreateUser extends Operation<Input, Output> {
   protected async run(requestData: Input): Promise<Output> {
    const userData: Input = requestData
    const existingUser: User | undefined = await userRepository.findByEmail(userData.email)
    
    if (existingUser) {
      throw new ConflictError('User already exists.')
    }

    const user: User = await userRepository.insert(userData)

    return { user }
   }
}

export const createUser = new CreateUser()