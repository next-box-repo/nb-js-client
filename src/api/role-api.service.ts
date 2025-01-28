import { Client } from '../classes';
import {
    CreateRoleParams,
    RequestRoleListParams,
    ResponseItem,
    ResponseList,
    Role,
    Permission,
} from '../types';

const ROLES = '/roles';
const ROLES_DEFAULT = `${ROLES}/default`;
const PERMISSION = '/permissions';

export class RoleApi {
    constructor(private client: Client) {}

    list(params?: RequestRoleListParams): Promise<ResponseList<Role>> {
        return this.client.rest.get(ROLES, params);
    }

    get(id: number): Promise<ResponseItem<Role>> {
        return this.client.rest.get(`${ROLES}/${id}`);
    }

    getDefault(): Promise<ResponseItem<Role>> {
        return this.client.rest.get(`${ROLES_DEFAULT}`);
    }

    create(data: CreateRoleParams): Promise<ResponseItem<Role>> {
        return this.client.rest.post(ROLES, JSON.stringify(data));
    }

    update(
        id: number,
        data: Partial<CreateRoleParams>,
    ): Promise<ResponseItem<Role>> {
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
