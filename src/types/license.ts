export interface License {
    custom_max_users_count: number | null;
    expire_in?: string;
    technical_support_expire_in?: string;
    key: string | null;
    plan: Tariff;
    state: LicenseState;
    mode: LicenseMode;
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

export enum LicenseState {
    Purchased = 'purchased',
    Free = 'free',
}

export enum LicenseMode {
    Online = 'online',
    Offline = 'offline',
}
