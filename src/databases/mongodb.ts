import mongoose from "mongoose";
import HandleError from "../errors";


class Database {
    constructor(private readonly connectionString: string) {}
    private readonly connection?: mongoose.Connection;

    // connection database
    async connect(
        options?: mongoose.ConnectOptions
      ): Promise<mongoose.Connection> {
        if (this.connection) return this.connection;
    
        const connected = await mongoose
          .connect(this.connectionString)
          .catch((err: mongoose.MongooseError) => {
            const error = new HandleError({
              message: err.message,
              type: "Database Error",
            });
            // save logs
            error.saveLogs();
            throw error;
          });
        return connected.connection;
      }
}

export default Database;