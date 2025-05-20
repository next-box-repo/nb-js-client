import { RequestBaseParams } from './base';

export interface Limitation extends LimitationBody {
    id: number;
    users_count: number;
}

export interface RequestLimitationsListParams extends RequestBaseParams {
    name?: string;
    search?: string;
    subtype?: string;
    type?: string;
}

export interface CreateLimitationsParams extends LimitationBody {
    users: number[] | null;
    force: boolean;
}

interface LimitationBody {
    name: string;
    type: LimitationType;
    extensions?: string[];
    default: boolean;
    for_anonymous?: boolean;
    subtype?: LimitationSubType;
    size?: number;
}

export enum LimitationType {
    BySize = 'size',
    ByExt = 'extension',
}

export enum LimitationSubType {
    Size = 'size',
    White = 'extension_white',
    Black = 'extension_black',
}
