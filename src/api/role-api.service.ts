import { Client } from '../classes';
import {
    CreateUserRoleParams,
    RequestUserRoleListParams,
    ResponseItem,
    ResponseList,
    UserRole,
    Permission,
} from '../types';

const ROLES = '/roles';
const ROLES_DEFAULT = `${ROLES}/default`;
const PERMISSION = '/permissions';

export class RoleApi {
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
        return this.client.rest.post(ROLES, JSON.stringify(data));
    }

    update(
        id: number,
        data: Partial<CreateUserRoleParams>,
    ): Promise<ResponseItem<UserRole>> {
        return this.client.rest.put(`${ROLES}/${id}`, JSON.stringify(data));
    }

    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${ROLES}/${id}`);
    }

    permissionList(): Promise<ResponseList<Permission>> {
        return this.client.rest.get(PERMISSION);
    }

    addPermission(id: number, ids: number[]): Promise<void> {
        return this.client.rest.put(
            `${ROLES}/${id}/permissions`,
            JSON.stringify({ ids }),
        );
    }

    deletePermission(id: number, ids: number[]): Promise<void> {
        return this.client.rest.delete(`${ROLES}/${id}/permissions`, { ids });
    }
}
