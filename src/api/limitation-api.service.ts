import { Client } from '../classes';
import { RequestBaseParams, ResponseItem, ResponseList, User } from '../types';
import {
    RequestLimitationsListParams,
    Limitation,
    CreateLimitationsParams,
} from '../types/limitation';

const LIMITATIONS = '/limitations';
const LIMITATION_BY_USER = '/limitations/user';
const LIMITATION_ME = '/limitations/user/me';

export class LimitationsApiService {
    constructor(private client: Client) {}

    me(): Promise<Limitation[]> {
        return this.client.rest.get(`${LIMITATION_ME}`);
    }

    list(
        params: RequestLimitationsListParams,
    ): Promise<ResponseList<Limitation>> {
        return this.client.rest.get(LIMITATIONS, params);
    }

    listUsers(
        id: number,
        params?: RequestBaseParams,
    ): Promise<ResponseList<number>> {
        return this.client.rest.get(`${LIMITATIONS}/${id}/users`, params);
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

    getLimitationsByUser(id: number): Promise<Limitation[]> {
        return this.client.rest.get(`${LIMITATION_BY_USER}/${id}`);
    }

    addUserToLimitation(limitationId: number, userId: number): Promise<void> {
        return this.client.rest.patch(`${LIMITATIONS}/${limitationId}/user`, { id: userId })
    }

    deleteUserFromLimitation(limitationId: number, userId: number): Promise<void> {
        return this.client.rest.delete(`${LIMITATIONS}/${limitationId}/user/${userId}`)
    }
}
