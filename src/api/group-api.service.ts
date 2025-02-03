import { Client } from '../classes';
import {
    CreateUserGroupParams,
    RequestUserGroupListParams,
    ResponseItem,
    ResponseList,
    User,
    UserGroup,
} from '../types';

const GROUPS = '/groups';

export class GroupApi {
    constructor(private client: Client) {}

    list(params: RequestUserGroupListParams): Promise<ResponseList<UserGroup>> {
        return this.client.rest.get(GROUPS, params);
    }

    listUsers(id: number): Promise<ResponseList<User>> {
        return this.client.rest.get(`${GROUPS}/${id}/users`);
    }

    create(data: CreateUserGroupParams): Promise<ResponseItem<UserGroup>> {
        return this.client.rest.post(GROUPS, JSON.stringify(data));
    }

    update(
        id: number,
        data: CreateUserGroupParams,
    ): Promise<ResponseItem<UserGroup>> {
        return this.client.rest.put(`${GROUPS}/${id}`, JSON.stringify(data));
    }

    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${GROUPS}/${id}`);
    }
}
