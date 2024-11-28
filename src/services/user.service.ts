import { Api } from '../api';
import {
    CreateUserParams,
    ResponseItem,
    ResponseList,
    UpdateUserParams,
    User,
} from '../types';

const USERS = '/users';

export class UserService {
    constructor(private api: Api) {}

    list(query: any): Promise<ResponseList<User>> {
        return this.api.get(USERS, query);
    }

    get(id: number): Promise<ResponseItem<User>> {
        return this.api.get(USERS + `/${id}`);
    }

    create(data: CreateUserParams): Promise<ResponseItem<User>> {
        return this.api.post(USERS, JSON.stringify(data));
    }

    update(data: UpdateUserParams): Promise<ResponseItem<User>> {
        return this.api.put(USERS + `/${data.id}`, JSON.stringify(data));
    }

    delete(id: number, params?: { hard: boolean }): Promise<void> {
        return this.api.delete(`${USERS}/${id}`, params);
    }

    restore(id: number): Promise<void> {
        return this.api.post(`${USERS}/${id}/restore`);
    }
}
