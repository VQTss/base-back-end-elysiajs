import jwt from "@elysiajs/jwt";
import { t } from "elysia";
import mongoose from "mongoose";
import { findByUsernameAndPasswordDto } from "../../DTO/users";
import HandleError from "../../errors";
import { StatusCodes } from "../../global/enums";
import {} from "../../"
// Define types for store, body, and payload
interface Store {
    user: {
        _id: mongoose.Types.ObjectId;
        username?: string;
        displayName?: string;
        role?: string;
    };
}

interface TokenPayload {
    userId: string;
    exp: number;
}

export default (app: any) => {
    app.config.prefix = "/api/user";
    return app.get('/login', async ({ body }: { body: { username: string; password: string } }) => {
        const { username, password } = body;
        const userData: findByUsernameAndPasswordDto = {
            username: username,
            password: password,
        }
        // validate user data
        const error = new HandleError({
            message: "Data Validation Failed Invalid Data",
            errors: [],
            type: "Authentication Error",
            status: StatusCodes.badRequest,
        });
        if (!userData.username)
            error.error.errors?.push({ firstName: "Usernames is Required" });
        if (!userData.password)
            error.error.errors?.push({ email: "Password is Required" });

        if (error.error.errors?.length) throw error;

        // Find user in database

        console.log("User", userData);
        




    }, {
        detail: {
            summary: "User Login",
            tags: ["Auth"],
        },
        body: t.Object({
            username: t.String({ description: "User's username" }),
            password: t.String({ description: "User's password" }),
        }),

    })
}