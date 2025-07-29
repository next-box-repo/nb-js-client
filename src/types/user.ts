import { RequestBaseParams } from './base';

export interface User {
    id: number;
    create_date: string;
    update_date: string;
    last_login_date: string;
    last_update_password_date: string;
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
    phone?: string;
}

export type UserLabel = Pick<
    User,
    | 'login'
    | 'email'
    | 'first_name'
    | 'middle_name'
    | 'last_name'
    | 'avatar_path'
>;

export interface UserInfo extends UserLabel {
    id: number;
}

export enum UserAuthType {
    Native = 'native',
    Ldap = 'ldap',
    Vk = 'vk',
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

export interface UserParams {
    name: UserParamsLabel;
    value: any;
}

export enum UserParamsLabel {
    Theme = 'theme',
    Lang = 'lang',
    Sort = 'sort',
    ViewApps = 'viewApps',
    WithoutContentWorkDir = 'withoutContentWorkDir',
    DashboardGrid = 'dashboardGrid',
}

export interface UserAppPasswords {
    id: number;
    name: string;
    create_date: string;
    type: UserAppType;
}

export interface UserAppPasswordInfo extends UserAppPasswords {
    password: string;
}

export enum UserAppType {
    Webdav = 'webdav',
}
