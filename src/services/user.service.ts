import { Client } from '../client';
import {
    CreateUserParams,
    ResponseItem,
    ResponseList,
    UpdateUserParams,
    User,
} from '../types';

const USERS = '/users';

export class UserService {
    constructor(private client: Client) {}

    list(query: any): Promise<ResponseList<User>> {
        return this.client.get(USERS, query);
    }

    get(id: number): Promise<ResponseItem<User>> {
        return this.client.get(USERS + `/${id}`);
    }

    create(data: CreateUserParams): Promise<ResponseItem<User>> {
        return this.client.post(USERS, JSON.stringify(data));
    }

    update(data: UpdateUserParams): Promise<ResponseItem<User>> {
        return this.client.put(USERS + `/${data.id}`, JSON.stringify(data));
    }

    delete(id: number, params?: { hard: boolean }): Promise<void> {
        return this.client.delete(`${USERS}/${id}`, params);
    }

    restore(id: number): Promise<void> {
        return this.client.post(`${USERS}/${id}/restore`);
    }
}
