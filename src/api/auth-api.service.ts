import { Client } from '../classes';
import { AuthToken, AuthType } from '../types';

const LOGIN = '/login';
const LOGOUT = '/logout';
const LOGIN_LDAP = `${LOGIN}/ldap`;
const LOGIN_UPDATE = `${LOGIN}/update`;

export class AuthApiService {
    constructor(private client: Client) {}

    info(): Promise<AuthType> {
        return this.client.rest.get(LOGIN);
    }

    login(data: {
        login: string;
        password: string;
        is_remember: boolean;
    }): Promise<AuthToken> {
        return this.client.rest.post(LOGIN, JSON.stringify(data));
    }

    ldapLogin(data: {
        login: string;
        password: string;
        is_remember: boolean;
    }): Promise<AuthToken> {
        return this.client.rest.post(LOGIN_LDAP, JSON.stringify(data));
    }

    updateToken(data: AuthToken): Promise<any> {
        const path = data.path ? `${data.path}/${LOGIN_UPDATE}` : LOGIN_UPDATE;

        return this.client.rest.post(path, JSON.stringify(data));
    }

    logout(): Promise<void> {
        return this.client.rest.post(LOGOUT);
    }
}
