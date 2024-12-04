export interface License {
    custom_max_users_count: number | null;
    expire_in: string;
    key: string | null;
    plan: Tariff;
    error?: LicenseError | string;
}

export interface ChangeLicenseParams {
    key: string;
    domain: string;
}

export enum Tariff {
    Free = 'free',
    Business = 'business',
    Enterprise = 'enterprise',
}

export enum LicenseError {
    NotActivated = 'License not activated',
    Blocked = 'License blocked',
    Expired = 'License has been expired',
    NotValid = 'License not valid',
    NotFound = 'license file not found',
}
