import { Client } from '../classes';
import {
    RequestBaseParams,
    ResponseItem,
    ResponseList,
    User,
    UserGroup,
} from '../types';

const GROUPS = '/groups';

export class GroupApiService {
    constructor(private client: Client) {}

    list(params: RequestUserGroupListParams): Promise<ResponseList<UserGroup>> {
        return this.client.rest.get(GROUPS, params);
    }

    listUsers(
        id: number,
        params?: RequestBaseParams,
    ): Promise<ResponseList<User>> {
        return this.client.rest.get(`${GROUPS}/${id}/users`, params);
    }

    create(data: CreateUserGroupParams): Promise<ResponseItem<UserGroup>> {
        return this.client.rest.post(GROUPS, data);
    }

    update(
        id: number,
        data: CreateUserGroupParams,
    ): Promise<ResponseItem<UserGroup>> {
        return this.client.rest.put(`${GROUPS}/${id}`, data);
    }

    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${GROUPS}/${id}`);
    }
}

export interface RequestUserGroupListParams extends RequestBaseParams {
    id?: number[];
    name?: string;
    description?: string;
    search_field?: string;
}

export type CreateUserGroupParams = Pick<UserGroup, 'name' | 'description'> & {
    users?: number[];
};
