import { Api } from '../classes';
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
    constructor(private api: Api) {}

    list(params: RequestGroupListParams): Promise<ResponseList<Group>> {
        return this.api.get(GROUPS, params);
    }

    listUsers(id: number): Promise<ResponseList<User>> {
        return this.api.get(`${GROUPS}/${id}/users`);
    }

    create(data: CreateGroupParams): Promise<ResponseItem<Group>> {
        return this.api.post(GROUPS, JSON.stringify(data));
    }

    update(id: number, data: CreateGroupParams): Promise<ResponseItem<Group>> {
        return this.api.put(`${GROUPS}/${id}`, JSON.stringify(data));
    }

    delete(id: number): Promise<void> {
        return this.api.delete(`${GROUPS}/${id}`);
    }
}
