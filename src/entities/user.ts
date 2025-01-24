import { ID } from "../global/entities";


interface IUsers {
    id?: ID;
    email?: string; // check for invalid email address
    username?: string; // check for regex pattern username 
    password?: string; // check regex password before to save password
    displayName?: string; 
    passwordHash?: string;
    firstname?: string;
    lastname?: string;
    address?: string;
    phone?: string; // check for regex pattern
    verify?: boolean;
    refresh_token?: string;
    access_token?: string;
    tokenExpire?: Date;
    permission?: string;
    role?: string;
    kyc?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export default IUsers;