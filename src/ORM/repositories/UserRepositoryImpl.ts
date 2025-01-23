import { Model } from "mongoose";
import IUser from "../../entities/user";
import IBaseRepository from "../../global/repository";
import { UserModel } from "../models/users";
import { toArray } from "../../utils/functions";
import AppError from "../../errors/index";
import { StatusCodes } from "../../global/enums/index";
import { ID, IResponseData, IResponseDataPaginated } from "../../global/entities";

export class UserRepositoryImpl implements IBaseRepository<IUser> {
  constructor(private readonly model: Model<IUser>) {}

  // Create a single or multiple users
  async create(data: IUser | IUser[]): Promise<IResponseData<IUser>> {
    try {
      // Handle multiple users
      if (Array.isArray(data)) {
        const users = await this.model.insertMany(data as IUser[]);
        return {
          data: users[0], // Return the first user to match the expected type
          status: StatusCodes.created,
          message: `${users.length} user(s) created successfully.`,
        };
      }
  
      // Handle a single user
      const user = await this.model.create(data);
      return {
        data: user,
        status: StatusCodes.created,
        message: "User created successfully.",
      };
    } catch (error) {
      throw new AppError({
        message: `Error creating user: ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
      });
    }
  }
  
  
  

  // Update a single or multiple users
  async update(data: IUser | IUser[]): Promise<IResponseData<IUser>> {
    try {
      const updatedUsers = Array.isArray(data)
        ? await Promise.all(
            data.map((user) =>
              this.model.findByIdAndUpdate(user.id, user, { new: true }).exec()
            )
          )
        : await this.model.findByIdAndUpdate(data.id, data, { new: true }).exec();

      return {
        success: true,
        data: toArray(updatedUsers),
      };
    } catch (error) {
      throw new AppError({
        message: error.message,
        type: "Database Error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Delete a user by ID
  async delete(id: ID): Promise<IResponseData<IUser>> {
    try {
      const deletedUser = await this.model.findByIdAndDelete(id).exec();

      if (!deletedUser) {
        throw new AppError({
          message: "User not found.",
          type: "Not Found",
          status: StatusCodes.NOT_FOUND,
        });
      }

      return {
        success: true,
        data: deletedUser,
      };
    } catch (error) {
      throw new AppError({
        message: error.message,
        type: "Database Error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Find a user by ID
  async find(id: ID): Promise<IResponseData<IUser>> {
    try {
      const user = await this.model.findById(id).exec();

      if (!user) {
        throw new AppError({
          message: "User not found.",
          type: "Not Found",
          status: StatusCodes.NOT_FOUND,
        });
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new AppError({
        message: error.message,
        type: "Database Error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Find all users
  async findAll(): Promise<IResponseData<IUser[]>> {
    try {
      const users = await this.model.find().exec();

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      throw new AppError({
        message: error.message,
        type: "Database Error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Find all users with pagination
  async findAllPaginated(
    page: number,
    limit: number
  ): Promise<IResponseDataPaginated> {
    try {
      const skip = (page - 1) * limit;
      const total = await this.model.countDocuments().exec();
      const users = await this.model.find().skip(skip).limit(limit).exec();

      return {
        success: true,
        data: users,
        pagination: {
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      throw new AppError({
        message: error.message,
        type: "Database Error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Count the total number of users
  async count(): Promise<number> {
    try {
      return await this.model.countDocuments().exec();
    } catch (error) {
      throw new AppError({
        message: error.message,
        type: "Database Error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Search users with a query
  async search(query: any): Promise<IResponseData<IUser[]>> {
    try {
      const users = await this.model.find(query).exec();

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      throw new AppError({
        message: error.message,
        type: "Database Error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Search users with pagination
  async searchPaginated(
    query: any,
    page: number,
    limit: number
  ): Promise<IResponseDataPaginated> {
    try {
      const skip = (page - 1) * limit;
      const total = await this.model.countDocuments(query).exec();
      const users = await this.model.find(query).skip(skip).limit(limit).exec();

      return {
        success: true,
        data: users,
        pagination: {
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      throw new AppError({
        message: error.message,
        type: "Database Error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Check if a user exists by ID
  async exists(id: ID): Promise<boolean> {
    try {
      return await this.model.exists({ _id: id }).exec() != null;
    } catch (error) {
      throw new AppError({
        message: error.message,
        type: "Database Error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
