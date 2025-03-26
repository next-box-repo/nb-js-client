import { Client } from '../classes';
import {
    ResponseItem,
    ResponseList,
    UserRole,
    Permission,
    RequestBaseParams,
} from '../types';

const ROLES = '/roles';
const ROLES_DEFAULT = `${ROLES}/default`;
const PERMISSIONS = '/permissions';

export class RoleApiService {
    constructor(private client: Client) {}

    list(params?: RequestUserRoleListParams): Promise<ResponseList<UserRole>> {
        return this.client.rest.get(ROLES, params);
    }

    get(id: number): Promise<ResponseItem<UserRole>> {
        return this.client.rest.get(`${ROLES}/${id}`);
    }

    getDefault(): Promise<ResponseItem<UserRole>> {
        return this.client.rest.get(`${ROLES_DEFAULT}`);
    }

    create(data: CreateUserRoleParams): Promise<ResponseItem<UserRole>> {
        return this.client.rest.post(ROLES, data);
    }

    update(
        id: number,
        data: Partial<CreateUserRoleParams>,
    ): Promise<ResponseItem<UserRole>> {
        return this.client.rest.put(`${ROLES}/${id}`, data);
    }

    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${ROLES}/${id}`);
    }

    permissionList(): Promise<ResponseList<Permission>> {
        return this.client.rest.get(PERMISSIONS);
    }

    addPermission(id: number, ids: number[]): Promise<void> {
        return this.client.rest.put(`${ROLES}/${id}/permissions`, { ids });
    }

    deletePermission(id: number, ids: number[]): Promise<void> {
        return this.client.rest.delete(`${ROLES}/${id}/${PERMISSIONS}`, {
            ids,
        });
    }
}

export interface RequestUserRoleListParams extends RequestBaseParams {
    id?: number[];
    search_field?: string;
}

export type CreateUserRoleParams = Pick<
    UserRole,
    'name' | 'description' | 'grant_access_all' | 'is_default'
>;
