export interface User {
    id: number;
    create_date: string;
    update_date: string;
    last_login_date: string;
    login: string;
    password: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    auth_type: UserAuthType;
    avatar_path: string;
    home_path: string;
    status: UserStatus;
    type: UserType;
    role_id: number | null;
}

export enum UserAuthType {
    Native = 'native',
    Ldap = 'ldap',
}

export enum UserStatus {
    Registering = 'registering',
    Activated = 'activated',
    Blocked = 'blocked',
    BlockedByLicense = 'blocked_by_license',
}

export enum UserType {
    User = 'user',
    Guest = 'guest',
}

export type UpdateUserParams = Pick<
    User,
    | 'first_name'
    | 'last_name'
    | 'middle_name'
    | 'email'
    | 'home_path'
    | 'id'
    | 'role_id'
>;

export type CreateUserParams = Pick<
    User,
    | 'first_name'
    | 'last_name'
    | 'middle_name'
    | 'email'
    | 'home_path'
    | 'password'
    | 'role_id'
>;
