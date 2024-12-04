import { Client } from '../classes';
import {
    CreateGroupParams,
    Group,
    RequestGroupListParams,
    ResponseItem,
    ResponseList,
    User,
} from '../types';

const GROUPS = '/groups';

export class GroupApiService {
    constructor(private client: Client) {}

    list(params: RequestGroupListParams): Promise<ResponseList<Group>> {
        return this.client.rest.get(GROUPS, params);
    }

    listUsers(id: number): Promise<ResponseList<User>> {
        return this.client.rest.get(`${GROUPS}/${id}/users`);
    }

    create(data: CreateGroupParams): Promise<ResponseItem<Group>> {
        return this.client.rest.post(GROUPS, JSON.stringify(data));
    }

    update(id: number, data: CreateGroupParams): Promise<ResponseItem<Group>> {
        return this.client.rest.put(`${GROUPS}/${id}`, JSON.stringify(data));
    }

    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${GROUPS}/${id}`);
    }
}
