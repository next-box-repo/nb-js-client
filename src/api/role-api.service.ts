import { Api } from '../classes';
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

export class RoleApiService {
    constructor(private api: Api) {}

    list(params?: RequestRoleListParams): Promise<ResponseList<Role>> {
        return this.api.get(ROLES, params);
    }

    get(id: number): Promise<ResponseItem<Role>> {
        return this.api.get(`${ROLES}/${id}`);
    }

    getDefault(): Promise<ResponseItem<Role>> {
        return this.api.get(`${ROLES_DEFAULT}`);
    }

    create(data: CreateRoleParams): Promise<ResponseItem<Role>> {
        return this.api.post(ROLES, JSON.stringify(data));
    }

    update(id: number, data: CreateRoleParams): Promise<ResponseItem<Role>> {
        return this.api.put(`${ROLES}/${id}`, JSON.stringify(data));
    }

    delete(id: number): Promise<void> {
        return this.api.delete(`${ROLES}/${id}`);
    }

    permissions(): Promise<ResponseList<Permission>> {
        return this.api.get(PERMISSION);
    }

    addPermissions(id: number, ids: number[]): Promise<void> {
        return this.api.put(
            `${ROLES}/${id}/permissions`,
            JSON.stringify({ ids }),
        );
    }

    deletePermissions(id: number, ids: number[]): Promise<void> {
        return this.api.delete(`${ROLES}/${id}/permissions`, { ids });
    }
}
