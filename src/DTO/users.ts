export interface CreateUserDto {
    username: string;
    password: string;
}

export interface findUserByIdDto {
    id: string;
}

export interface updateUserDto {
    id: string;
    username?: string;
}

export interface deleteUserDto {
    id: string;
}

export interface findByUsernameAndPasswordDto {
    username: string;
    password: string;
}

export interface findUsersDto {
    username?: string;
}
