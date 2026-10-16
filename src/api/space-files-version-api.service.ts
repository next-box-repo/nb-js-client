import { Client } from '../classes';
import {
    RequestBaseParams,
    ResponseItem,
    ResponseList,
    StorageElementVersion,
} from '../types';

const SPACES = '/spaces';
const FILES_VERSION = '/files/version';
const FILES_VERSION_CURRENT = '/files/version/current';

export class SpaceFilesVersionApiService {
    constructor(private client: Client) {}

    versions(
        id: number,
        params: SpaceFileHistoryListRequestParams,
    ): Promise<ResponseList<StorageElementVersion>> {
        return this.client.rest.get(`${SPACES}/${id}${FILES_VERSION}`, params);
    }

    create(
        id: number,
        params: HistoryCreateParams,
    ): Promise<ResponseItem<StorageElementVersion>> {
        return this.client.rest.post(`${SPACES}/${id}${FILES_VERSION}`, params);
    }

    edit(
        id: number,
        params: HistoryCreateParams,
    ): Promise<ResponseItem<StorageElementVersion>> {
        return this.client.rest.put(`${SPACES}/${id}${FILES_VERSION}`, params);
    }

    delete(id: number, params: SpaceFileHistoryRequestParams): Promise<void> {
        return this.client.rest.delete(
            `${SPACES}/${id}${FILES_VERSION}`,
            params,
        );
    }

    makeCurrent(
        id: number,
        params: SpaceFileHistoryRequestParams,
    ): Promise<void> {
        return this.client.rest.post(
            `${SPACES}/${id}${FILES_VERSION_CURRENT}`,
            params,
        );
    }
}

export type SpaceFileHistoryListRequestParams = SpaceFileHistoryRequestParams &
    RequestBaseParams;

export interface SpaceFileHistoryRequestParams {
    file_id?: string;
    file_version_id?: string;
}

export interface HistoryCreateParams extends SpaceFileHistoryRequestParams {
    name: string;
    description: string;
}
