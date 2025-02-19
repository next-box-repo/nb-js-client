import { Client } from '../classes';
import {
    HttpEvent,
    OnUploadProgress,
    ResponseItem,
    ResponseList,
    StorageElement,
} from '../types';
import { ConnectionCreateParams } from './connections-api.service';
import {
    CreateStorageElementParams,
    RequestStorageListParams,
} from './storage-element-api.service';
import { UploadNetRequestParams } from './storage-files-api.service';

const DISK = '/disk';
const DISK_CHECK = `${DISK}/check`;

export class FcaApiService {
    constructor(private client: Client) {}

    info(rootID: number, path: string): Promise<StorageElement> {
        return this.client.rest.get(`${DISK}/${rootID}/element`, { path });
    }

    list(
        rootID: number,
        params?: RequestStorageListParams,
    ): Promise<ResponseList<StorageElement>> {
        return this.client.rest.get(`${DISK}/${rootID}`, params);
    }

    create(rootID: number, data: CreateStorageElementParams): Promise<any> {
        return this.client.rest.post(
            `${DISK}/${rootID}/element`,
            JSON.stringify(data),
        );
    }

    replace(
        rootID: number,
        path: string,
        data: any,
    ): Promise<ResponseItem<StorageElement>> {
        return this.client.rest.put(
            `${DISK}/${rootID}/files?path=${path}`,
            data,
        );
    }

    read(id: number, path: string): Promise<ResponseItem<any>> {
        return this.client.rest.get(`${DISK}/${id}/files?path=${path}`);
    }

    upload(
        onProgress: OnUploadProgress,
        rootID: number,
        file: File,
        path = '',
    ): {
        promise: Promise<HttpEvent<ResponseItem<StorageElement>>>;
        abort: () => void;
    } {
        const form = new FormData();
        form.set('path', path);
        form.set('file', file);

        const { promise, abort } = this.client.rest.upload(
            `${DISK}/${rootID}/files`,
            form,
            {
                onUploadProgress: (event) => {
                    onProgress(event);
                },
            },
        );

        return { promise, abort };
    }

    uploadNet(
        rootID: number,
        params: UploadNetRequestParams,
    ): Promise<ResponseItem<StorageElement>> {
        return this.client.rest.post(
            `${DISK}/${rootID}/files/net`,
            JSON.stringify(params),
        );
    }

    delete(rootID: number, path: string): Promise<void> {
        return this.client.rest.delete(`${DISK}/${rootID}/trash/element`, {
            path,
        });
    }

    check(data: ConnectionCreateParams): Promise<void> {
        return this.client.rest.post(DISK_CHECK, JSON.stringify(data));
    }
}
