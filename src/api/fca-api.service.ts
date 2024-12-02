import { Api } from '../classes';
import {
    ConnectionCreateParams,
    RequestStorageListParams,
    ResponseItem,
    ResponseList,
    StorageElement,
    CreateStorageElementParams,
} from '../types';

const DISK = '/disk';
const DISK_CHECK = `${DISK}/check`;

export class FcaApiService {
    constructor(private api: Api) {}

    info(rootID: number, path: string): Promise<StorageElement> {
        return this.api.get(`${DISK}/${rootID}/element`, { path });
    }

    list(
        rootID: number,
        params?: RequestStorageListParams,
    ): Promise<ResponseList<StorageElement>> {
        return this.api.get(`${DISK}/${rootID}`, params);
    }

    create(rootID: number, data: CreateStorageElementParams): Promise<any> {
        return this.api.post(`${DISK}/${rootID}/element`, JSON.stringify(data));
    }

    replace(
        rootID: number,
        path: string,
        data: any,
    ): Promise<ResponseItem<StorageElement>> {
        return this.api.put(`${DISK}/${rootID}/files?path=${path}`, data);
    }

    read(id: number, path: string): Promise<ResponseItem<any>> {
        return this.api.get(`${DISK}/${id}/files?path=${path}`);
    }

    upload(
        rootID: number,
        file: File,
        path = '',
    ): Promise<ResponseItem<StorageElement>> {
        const form = new FormData();
        form.set('path', path);
        form.set('file', file);

        return this.api.post(`${DISK}/${rootID}/files`, form);
    }

    delete(rootID: number, path: string): Promise<void> {
        return this.api.delete(`${DISK}/${rootID}/trash/element`, { path });
    }

    check(data: ConnectionCreateParams): Promise<void> {
        return this.api.post(DISK_CHECK, JSON.stringify(data));
    }
}
