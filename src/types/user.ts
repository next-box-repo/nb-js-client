import { RequestBaseParams } from './base';

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

export type UserLabel = Pick<
    User,
    'login' | 'email' | 'first_name' | 'middle_name' | 'last_name'
>;

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
    Emperor = 'emperor',
    Anonymous = 'anonymous',
}

export interface UserSession {
    create_date: string;
    expire_in: string;
    ip: string;
    user_agent: string;
    id: number;
    is_current?: boolean;
}

export interface UserToken {
    id: number;
    name: string;
    expire_in: string;
    create_date: string;
    token?: string;
}

export interface RequestUserListParams extends RequestBaseParams {
    email?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    login?: string;
    is_admin?: boolean;
    id?: number[];
    role_ids?: number[];
    statuses?: UserStatus[];
    search_field?: string;
    with_me?: boolean;
    type?: UserType;
    exclude_type?: UserType;
}

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

export interface UserGroup {
    id: number;
    name: string;
    description: string;
    amount_users: number;
    create_date: string;
    owner_id: number;
    owner: UserLabel;
    update_date: string;
    icon: string;
    icon_color: string;
}

export interface RequestUserGroupListParams extends RequestBaseParams {
    id?: number[];
    name?: string;
    description?: string;
    search_field?: string;
}

export type CreateUserGroupParams = Pick<UserGroup, 'name' | 'description'> & {
    users?: number[];
};

export interface UserRole {
    id: number;
    name: string;
    description: string;
    create_date: string;
    update_date: string;
    is_default: boolean;
    owner_id: number;
    grant_access_all: boolean;
    permissions_id?: number[];
}

export interface RequestUserRoleListParams extends RequestBaseParams {
    id?: number[];
    search_field?: string;
}

export type CreateUserRoleParams = Pick<
    UserRole,
    'name' | 'description' | 'grant_access_all' | 'is_default'
>;
