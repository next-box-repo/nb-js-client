import { Client } from '../classes';
import {
    HttpEvent,
    OnUploadProgress,
    ResponseItem,
    StorageElement,
} from '../types';

const STORAGE_FILES = '/storage/files';
const STORAGE_FILES_NET = `${STORAGE_FILES}/net`;

export class StorageFilesApiService {
    constructor(private client: Client) {}

    read(path: string, params: any): Promise<ResponseItem<any>> {
        params['path'] = path;

        return this.client.rest.get(STORAGE_FILES, params);
    }

    replace(
        params: { path: string; divide_id?: number },
        data: any,
    ): Promise<ResponseItem<StorageElement>> {
        const search = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            // @ts-ignore
            if (params[key]) search.append(key, params[key]);
        });

        return this.client.rest.put(
            `${STORAGE_FILES}?${search.toString()}`,
            data,
        );
    }

    upload(
        onProgress: OnUploadProgress,
        file: File,
        path: string,
        divide_id?: number,
    ): {
        promise: Promise<HttpEvent<ResponseItem<StorageElement>>>;
        abort: () => void;
    } {
        const form = new FormData();

        form.set('path', path);

        if (divide_id) form.set('divide_id', divide_id.toString());

        form.set('file', file);

        const { promise, abort } = this.client.rest.upload(
            STORAGE_FILES,
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
        data: UploadNetRequestParams,
    ): Promise<ResponseItem<StorageElement>> {
        return this.client.rest.post(STORAGE_FILES_NET, data);
    }
}

export interface UploadNetRequestParams {
    path: string;
    url: string;
    overwrite?: boolean;
    divide_id?: number;
    connection_divide_id?: number;
}
