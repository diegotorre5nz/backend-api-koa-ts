import { NotFoundError } from "../../../utils/errors"
import { User } from "../../../database/models/user"
import { userRepository } from "../../../database/repositories/user"
import { Operation } from "../../operation"

export type Input = Pick<User, 'id'> 

class GetUser extends Operation<Input, User> {
   protected async run(requestData: Input): Promise<User> {
    const {id} = requestData
    const existingUser: User | undefined = await userRepository.findById(id)

    if (!existingUser) {
      throw new NotFoundError
    }

    const userData = {
      name: existingUser.name,
      email: existingUser.email,
      password: existingUser.password,
    }

    return existingUser
   }
}

export const getUser = new GetUser()