import { CreateUserDto } from "../../DTO/users";
import IUsers from "../../entities/user";
import { IResponseData } from "../../global/entities";
import { BaseUseCase } from "../../global/usecase";
import { UserRepositoryImpl } from "../../ORM/repositories/UserRepositoryImpl";
import { StatusCodes } from "../../global/enums";
import AppError from "../../errors";

export class FindUsers implements BaseUseCase<Partial<IUsers>, IResponseData<IUsers>> {
  constructor(private readonly userRepositoryImpl: UserRepositoryImpl) { }

  async execute(input: CreateUserDto): Promise<IResponseData<IUsers>> {
    try {
      const newUser = await this.userRepositoryImpl.findByUsernameAndPassword(
        input.username,
        input.password
      );
      console.log("new user", newUser);
      
      if (!newUser.data || !Array.isArray(newUser.data)) {
        throw new AppError({
          message: "No user created",
          type: "Validation Error",
          status: StatusCodes.badRequest,
        });
      }

      return {
        data: newUser.data[0],
        message: "User Created",
        status: StatusCodes.created,
        documentsModified: 1,
        type: "create user",
      };
    } catch (error: any) {
      throw new AppError(error);
    }
  }
}
