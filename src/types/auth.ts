export interface AuthToken {
    access_token: string;
    refresh_token: string;
    with_cookie?: boolean;
    path?: string;
}

export interface AuthType {
    classic: boolean;
    basic: boolean;
    ldap: boolean;
}
