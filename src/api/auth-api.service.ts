import { Api } from '../classes';
import { AuthToken, AuthType } from '../types';

const LOGIN = '/login';
const LOGOUT = '/logout';
const LOGIN_LDAP = `${LOGIN}/ldap`;
const LOGIN_UPDATE = `${LOGIN}/update`;

export class AuthApiService {
    constructor(private api: Api) {}

    info(): Promise<AuthType> {
        return this.api.get(LOGIN);
    }

    login(data: {
        login: string;
        password: string;
        is_remember: boolean;
    }): Promise<AuthToken> {
        return this.api.post(LOGIN, JSON.stringify(data));
    }

    ldapLogin(data: {
        login: string;
        password: string;
        is_remember: boolean;
    }): Promise<AuthToken> {
        return this.api.post(LOGIN_LDAP, JSON.stringify(data));
    }

    updateToken(data: AuthToken): Promise<any> {
        return this.api.post(LOGIN_UPDATE, JSON.stringify(data));
    }

    logout(): Promise<void> {
        return this.api.post(LOGOUT);
    }
}
