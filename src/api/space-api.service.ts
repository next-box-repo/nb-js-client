import { Client } from '../classes';
import { RequestBaseParams, ResponseList } from '../types';
import { Space, SpaceAccess, SpaceAdmin } from '../types/space';

const SPACES = '/spaces';

export class SpaceApiService {
    constructor(private client: Client) {}

    list(params: RequestSpaceListParams): Promise<ResponseList<Space>> {
        return this.client.rest.get(SPACES, params);
    }

    create(params: RequestSpaceCreateParams): Promise<Space> {
        return this.client.rest.post(SPACES, params);
    }

    update(id: number, params: RequestSpaceUpdateParams): Promise<Space> {
        return this.client.rest.put(`${SPACES}/${id}`, params);
    }

    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${SPACES}/${id}`);
    }

    adminsList(
        id: number,
        params: RequestSpaceAdminsListParams,
    ): Promise<ResponseList<SpaceAdmin>> {
        return this.client.rest.get(`${SPACES}/${id}`, params);
    }
}

export interface RequestSpaceListParams extends RequestBaseParams {
    search?: string;
}

export interface RequestSpaceCreateParams {
    icon: string;
    icon_color: string;
    name: string;
    space_accesses?: SpaceAccess[];
}

export type RequestSpaceUpdateParams = Omit<
    RequestSpaceCreateParams,
    'space_accesses'
>;

export type RequestSpaceAdminsListParams = Pick<
    RequestBaseParams,
    'limit' | 'offset'
>;
