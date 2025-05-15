import { Client } from '../classes';
import { RequestBaseParams, ResponseItem, ResponseList, User } from '../types';
import {
    RequestLimitationsListParams,
    Limitation,
    CreateLimitationsParams,
} from '../types/limitation';

const LIMITATIONS = '/limitations';
export class LimitationsApiService {
    constructor(private client: Client) {}
    list(
        params: RequestLimitationsListParams,
    ): Promise<ResponseList<Limitation>> {
        return this.client.rest.get(LIMITATIONS, params);
    }
    listUsers(id: number): Promise<ResponseList<number>> {
        return this.client.rest.get(`${LIMITATIONS}/${id}/users`);
    }
    create(data: CreateLimitationsParams): Promise<ResponseItem<Limitation>> {
        return this.client.rest.post(LIMITATIONS, data);
    }
    get(id: number): Promise<ResponseItem<Limitation>> {
        return this.client.rest.get(`${LIMITATIONS}/${id}`);
    }
    update(
        id: number,
        data: CreateLimitationsParams,
    ): Promise<ResponseItem<Limitation>> {
        return this.client.rest.put(`${LIMITATIONS}/${id}`, data);
    }
    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${LIMITATIONS}/${id}`);
    }
}
