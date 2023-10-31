import { NotFoundError } from "../../../utils/errors"
import { User } from "../../../database/models/user"
import { userRepository } from "../../../database/repositories/user"
import { Operation } from "../../operation"

export type Input = Pick<User, 'id'> 

export interface Output {
  user: User
}

class GetUser extends Operation<Input, Output> {
   protected async run(requestData: Input): Promise<Output> {
    const {id} = requestData
    const existingUser: User | undefined = await userRepository.findById(id)
    console.log(existingUser)
    if (!existingUser) {
      throw new NotFoundError
    }

    const userData = {
      name: existingUser.name,
      email: existingUser.email,
      password: existingUser.password,
    }

    return { 
      user: existingUser,
    }
   }
}

export const getUser = new GetUser()