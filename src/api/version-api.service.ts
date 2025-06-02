import { Client } from '../classes';
import {
    HistoryNote,
    RequestBaseParams,
    ResponseItem,
    ResponseList,
    StorageElementHistory,
    StorageElementVersion,
    StorageElementVersionLock,
} from '../types';

const STORAGE_ELEMENT = `/storage/element`;
const STORAGE_ELEMENT_HISTORY = `${STORAGE_ELEMENT}/history`;
const STORAGE_ELEMENT_VERSION = `${STORAGE_ELEMENT}/version`;
const STORAGE_ELEMENT_VERSION_LOCK = `${STORAGE_ELEMENT_VERSION}/lock`;
const STORAGE_ELEMENT_VERSION_UNLOCK = `${STORAGE_ELEMENT_VERSION}/unlock`;
const STORAGE_ELEMENT_VERSION_CURRENT = `${STORAGE_ELEMENT_VERSION}/current`;
const STORAGE_ELEMENT_VERSION_SIZE = `${STORAGE_ELEMENT_VERSION}/size`;

export class VersionApiService {
    constructor(private client: Client) {}

    history(
        params: HistoryRequestParams,
    ): Promise<ResponseList<StorageElementHistory>> {
        return this.client.rest.get(STORAGE_ELEMENT_HISTORY, params);
    }

    versions(
        params: HistoryListRequestParams,
    ): Promise<ResponseList<StorageElementVersion>> {
        return this.client.rest.get(STORAGE_ELEMENT_VERSION, params);
    }

    create(params: HistoryNote): Promise<ResponseItem<StorageElementVersion>> {
        return this.client.rest.post(STORAGE_ELEMENT_VERSION, params);
    }

    edit(params: HistoryNote): Promise<ResponseItem<StorageElementVersion>> {
        return this.client.rest.put(STORAGE_ELEMENT_VERSION, params);
    }

    delete(params: HistoryRequestParams): Promise<void> {
        return this.client.rest.delete(STORAGE_ELEMENT_VERSION, params);
    }

    size(params: HistoryRequestParams): Promise<number> {
        return this.client.rest.get(STORAGE_ELEMENT_VERSION_SIZE, params);
    }

    makeCurrent(params: HistoryRequestParams): Promise<void> {
        return this.client.rest.post(STORAGE_ELEMENT_VERSION_CURRENT, params);
    }

    lock(params: VersionLockRequestParams): Promise<StorageElementVersionLock> {
        return this.client.rest.post(STORAGE_ELEMENT_VERSION_LOCK, params);
    }

    unlock(params: VersionLockRequestParams): Promise<void> {
        return this.client.rest.post(STORAGE_ELEMENT_VERSION_UNLOCK, params);
    }
}

export type HistoryListRequestParams = HistoryRequestParams & RequestBaseParams;

export interface HistoryRequestParams {
    path: string;
    divide_id?: number | null;
    file_version_id?: string;
}

export interface VersionLockRequestParams {
    path: string;
    file_version_id: string;
    divide_id?: number;
}
