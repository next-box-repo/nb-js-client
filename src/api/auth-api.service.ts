import { Client } from '../classes';
import {
    RequestAuthSettingsParams,
    AuthToken,
    AuthType,
    RequestAuthTokenParams,
} from '../types';

const LOGIN = '/login';
const LOGOUT = '/logout';
const LOGIN_LDAP = `${LOGIN}/ldap`;
const LOGIN_UPDATE = `${LOGIN}/update`;

export class AuthApi {
    constructor(private client: Client) {}

    info(): Promise<AuthType> {
        return this.client.rest.get(LOGIN);
    }

    login(data: RequestAuthSettingsParams): Promise<AuthToken> {
        return this.client.rest.post(LOGIN, JSON.stringify(data));
    }

    ldapLogin(data: RequestAuthSettingsParams): Promise<AuthToken> {
        return this.client.rest.post(LOGIN_LDAP, JSON.stringify(data));
    }

    updateToken(data: RequestAuthTokenParams): Promise<AuthToken> {
        const path = data.path ? `${data.path}/${LOGIN_UPDATE}` : LOGIN_UPDATE;
        if (data.path) delete data.path;

        return this.client.rest.post(path, JSON.stringify(data));
    }

    logout(): Promise<void> {
        return this.client.rest.post(LOGOUT);
    }
}
