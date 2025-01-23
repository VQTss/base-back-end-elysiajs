import mongoose from "mongoose";
import IUsers from "../../entities/user";
import RegexValidator from "../../helpers/regex.validation";


const userSchema = new mongoose.Schema<IUsers>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 50,
        validate: {
            validator: (value: string) => RegexValidator.username(value),
            message:
                "Invalid username format. Must be 3-50 characters long with letters, numbers, or _ . -.",
        },
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        validate: {
            validator: (value: string) => RegexValidator.password(value),
            message:
                "Password must be at least 8 characters long, with at least 1 letter, 1 number, and 1 special character.",
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value: string) => RegexValidator.email(value),
            message: "Invalid email address.",
        },
    },
    passwordHash: {
        type: String,
        required: [true, "Password hash is required."],
        trim: true,
    },
    role: {
        type: String,
        required: [true, "Role is required."],
        default: "user",
        trim: true,
    },
    kyc: {
        type: Boolean,
        required: [true, "Kyc field is required."],
        default: false,
    },
    verify: {
        type: Boolean,
        required: [true, "Verify field is required."],
        default: false,
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: (value: string) => RegexValidator.phone(value),
            message: "Invalid phone number format.",
        },
    },
},
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.models.Users || mongoose.model<IUsers>("Users", userSchema);