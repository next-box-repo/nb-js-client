import { RequestBaseParams } from './base';

export interface Role {
    id: number;
    name: string;
    description: string;
    create_date: string;
    update_date: string;
    is_default: boolean;
    owner_id: number;
    grant_access_all: boolean;
    permissions_id?: number[];
}

export interface RequestRoleListParams extends RequestBaseParams {
    id?: number[];
    search_field?: string;
}

export type CreateRoleParams = Pick<
    Role,
    'name' | 'description' | 'grant_access_all' | 'is_default'
>;
