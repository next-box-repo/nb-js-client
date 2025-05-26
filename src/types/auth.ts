export interface AuthToken {
    access_token?: string;
    refresh_token?: string;
    temp_token?: string;
    masked_phone?: string;
    code_ttl?: number;
    tfa_attempts?: number;
    two_factor_auth_required: boolean;
}

export interface AuthType {
    classic: boolean;
    basic: boolean;
    ldap: boolean;
}
