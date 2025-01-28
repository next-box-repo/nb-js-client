export interface AuthToken {
    access_token: string;
    refresh_token: string;
}

export interface RequestAuthTokenParams extends AuthToken {
    with_cookie?: boolean;
    path?: string;
}

export interface AuthType {
    classic: boolean;
    basic: boolean;
    ldap: boolean;
}

export interface RequestAuthSettingsParams {
    login: string;
    password: string;
    is_remember: boolean;
}
