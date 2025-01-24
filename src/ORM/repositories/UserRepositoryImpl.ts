import { Model } from "mongoose";
import IUser from "../../entities/user";
import IBaseRepository from "../../global/repository";
import AppError from "../../errors/index";
import { StatusCodes } from "../../global/enums/index";
import { ID, IResponseData, IResponseDataPaginated } from "../../global/entities";

export class UserRepositoryImpl implements IBaseRepository<IUser> {
  constructor(private readonly model: Model<IUser>) {}

  // Create a single or multiple users
  async create(data: IUser | IUser[]): Promise<IResponseData<IUser>> {
    try {
      let result: IUser | IUser[];
      if (Array.isArray(data)) {
        result = await this.model.insertMany(data as IUser[]);
      } else {
        result = await this.model.create(data);
      }
      return {
        data: Array.isArray(result) ? result[0] : result, // Return the first user if array
        status: StatusCodes.created,
        message: "User(s) created successfully.",
      };
    } catch (error) {
      throw new AppError({
        message: `Error creating user(s): ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
      });
    }
  }

  // Update a single or multiple users
  async update(data: IUser | IUser[]): Promise<IResponseData<IUser>> {
    try {
      if (Array.isArray(data)) {
        // Handle multiple updates
        const updatedUsers = await Promise.all(
          data.map(async (user) => {
            const updatedUser = await this.model.findByIdAndUpdate(user.id, user, { new: true }).exec();
            if (!updatedUser) {
              throw new AppError({
                message: `User with ID ${user.id} not found.`,
                type: "Not Found",
                status: StatusCodes.notFound,
              });
            }
            return updatedUser;
          })
        );
  
        return {
          data: updatedUsers[0], // Return the first updated user
          status: StatusCodes.ok,
          message: `${updatedUsers.length} user(s) updated successfully.`,
        };
      } else {
        // Handle single update
        const updatedUser = await this.model.findByIdAndUpdate(data.id, data, { new: true }).exec();
  
        if (!updatedUser) {
          throw new AppError({
            message: `User with ID ${data.id} not found.`,
            type: "Not Found",
            status: StatusCodes.notFound,
          });
        }
  
        return {
          data: updatedUser,
          status: StatusCodes.ok,
          message: "User updated successfully.",
        };
      }
    } catch (error) {
      throw new AppError({
        message: `Error updating user(s): ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
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
          status: StatusCodes.notFound,
        });
      }
      return {
        data: deletedUser,
        status: StatusCodes.ok,
        message: "User deleted successfully.",
      };
    } catch (error) {
      throw new AppError({
        message: `Error deleting user: ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
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
          status: StatusCodes.notFound,
        });
      }
      return {
        data: user,
        status: StatusCodes.ok,
        message: "User found successfully.",
      };
    } catch (error) {
      throw new AppError({
        message: `Error finding user found ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
      });
    }
  }

  // Find users by email
  async findByEmail(email: string): Promise<IResponseData<IUser>> {
    try {
      const user = await this.model.findOne({ email }).exec();
      if (!user) {
        throw new AppError({
          message: "User not found with the given email.",
          type: "Not Found",
          status: StatusCodes.notFound,
        });
      }
      return {
        data: user,
        status: StatusCodes.ok,
        message: "User found successfully.",
      };
    } catch (error) {
      throw new AppError({
        message: `Error finding user by email: ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
      });
    }
  }

  // Find users by username and password
  async findByUsernameAndPassword(username: string, password: string): Promise<IResponseData<IUser>> {
    try {
      const user = await this.model.findOne({ username, password }).exec();
      if (!user) {
        throw new AppError({
          message: "User not found with the given username and password.",
          type: "Not Found",
          status: StatusCodes.notFound,
        });
      }
      return {
        data: user,
        status: StatusCodes.ok,
        message: "User found successfully.",
      };
    } catch (error) {
      throw new AppError({
        message: `Error finding user by username and password: ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
      });
    }
  }

  // Find all users
  async findAll(): Promise<IResponseData<IUser[]>> {
    try {
      const users = await this.model.find().exec();
      return {
        data: users,
        status: StatusCodes.ok,
        message: "Users retrieved successfully.",
      };
    } catch (error) {
      throw new AppError({
        message: `Error finding all users: ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
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
      const totalCount = await this.model.countDocuments().exec();
      const users = await this.model.find().skip(skip).limit(limit).exec();
  
      return {
        data: users,
        page,
        limit,
        filterCount: users.length,
        totalCount,
        status: StatusCodes.ok,
        message: "Users retrieved successfully with pagination.",
      };
    } catch (error) {
      throw new AppError({
        message: `Failed to find users with pagination ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
      });
    }
  }

  // Count the total number of users
  async count(): Promise<number> {
    try {
      return await this.model.countDocuments().exec();
    } catch (error) {
      throw new AppError({
        message: `Error counting users: ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
      });
    }
  }

  // Search users with a query
  async search(query: any): Promise<IResponseData<IUser[]>> {
    try {
      const users = await this.model.find(query).exec();
      return {
        data: users,
        status: StatusCodes.ok,
        message: "Users retrieved successfully.",
      };
    } catch (error) {
      throw new AppError({
        message: `Error searching users: ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
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
      const totalCount = await this.model.countDocuments(query).exec();
      const users = await this.model.find(query).skip(skip).limit(limit).exec();
  
      return {
        data: users,
        page,
        limit,
        filterCount: users.length,
        totalCount,
        status: StatusCodes.ok,
        message: "Users retrieved successfully with pagination.",
      };
    } catch (error) {
      throw new AppError({
        message: `Error searching users with pagination: ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
      });
    }
  }

  // Check if a user exists by ID
  async exists(id: ID): Promise<boolean> {
    try {
      return (await this.model.exists({ _id: id }).exec()) !== null;
    } catch (error) {
      throw new AppError({
        message: `Error checking if user exists: ${error}`,
        type: "Database Error",
        status: StatusCodes.internalServerError,
      });
    }
  }
}
