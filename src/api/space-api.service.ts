import type { Client } from '../classes/client';
import { PermissionType, RequestBaseParams, ResponseList } from '../types';
import {
    Space,
    SpaceAccess,
    SpaceAccessProvide,
    SpaceAdmin,
} from '../types/space';

const SPACES = '/spaces';
const SPACES_ACCESS = `${SPACES}/access`;

export class SpaceApiService {
    constructor(private client: Client) {}

    space(id: number): Promise<Space> {
        return this.client.rest.get(`${SPACES}/${id}`);
    }

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
        return this.client.rest.get(`${SPACES}/${id}/admins`, params);
    }

    accessList(
        params: RequestSpaceAccessListParams,
    ): Promise<SpaceAcсessResponseList> {
        return this.client.rest.get(SPACES_ACCESS, params);
    }

    provideAccess(
        params: RequestProvideSpaceAccessParams,
    ): Promise<SpaceAccessProvide> {
        return this.client.rest.post(SPACES_ACCESS, params);
    }

    deleteAllAccess(params: RequestSpaceAccessParams): Promise<void> {
        return this.client.rest.delete(SPACES_ACCESS, params);
    }

    updateAccess(
        id: number,
        params: RequestUpdateSpaceAccessParams,
    ): Promise<SpaceAccessProvide> {
        return this.client.rest.put(`${SPACES_ACCESS}/${id}`, params);
    }

    deleteAccess(id: number, space_id: number): Promise<void> {
        return this.client.rest.delete(`${SPACES_ACCESS}/${id}`, { space_id });
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

export interface RequestSpaceAccessParams {
    space_id: number;
    access_mode?: PermissionType;
    file_container_id?: string;
    is_to_user_group?: boolean;
}

export type RequestSpaceAccessListParams = RequestSpaceAccessParams &
    RequestSpaceAdminsListParams;

export type SpaceAcсessResponseList = ResponseList<SpaceAccessProvide> & {
    total_r: number;
    total_rw: number;
    total_rwd: number;
    total_admin: number;
};

export interface RequestProvideSpaceAccessParams {
    access_mode: PermissionType;
    file_container_id?: string;
    space_id: number;
    to_user_group_id?: number;
    to_user_id?: number;
}

export type RequestUpdateSpaceAccessParams = Pick<
    RequestProvideSpaceAccessParams,
    'access_mode' | 'space_id'
>;
