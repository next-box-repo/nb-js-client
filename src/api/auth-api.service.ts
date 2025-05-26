import { Client } from '../classes';
import { AuthToken, AuthType } from '../types';

const LOGIN = '/login';
const LOGOUT = '/logout';
const LOGIN_LDAP = `${LOGIN}/ldap`;
const LOGIN_UPDATE = `${LOGIN}/update`;
const LOGIN_TFA = `${LOGIN}/tfa`;

export class AuthApiService {
    constructor(private client: Client) {}

    info(): Promise<AuthType> {
        return this.client.rest.get(LOGIN);
    }

    login(data: RequestAuthSettingsParams): Promise<AuthToken> {
        return this.client.rest.post(LOGIN, data);
    }

    ldapLogin(data: RequestAuthSettingsParams): Promise<AuthToken> {
        return this.client.rest.post(LOGIN_LDAP, data);
    }

    loginTfa(data: RequestAuthTfaParams): Promise<AuthToken> {
        return this.client.rest.post(LOGIN_TFA, data);
    }

    updateToken(data: RequestAuthTokenParams): Promise<AuthToken> {
        const path = data.path ? `${data.path}/${LOGIN_UPDATE}` : LOGIN_UPDATE;
        if (data.path) delete data.path;

        return this.client.rest.post(path, data);
    }

    logout(): Promise<void> {
        return this.client.rest.post(LOGOUT);
    }
}

export interface RequestAuthSettingsParams {
    login: string;
    password: string;
    is_remember: boolean;
}

export interface RequestAuthTfaParams {
    code: number;
    temp_token: string;
}

export interface RequestAuthTokenParams {
    access_token: string;
    refresh_token: string;
    with_cookie?: boolean;
    path?: string;
}
