import { Client } from '../classes';
import {
    HttpEvent,
    OnUploadProgress,
    ResponseItem,
    StorageElement,
} from '../types';

const STORAGE_FILES = '/storage/files';
const STORAGE_FILES_NET = `${STORAGE_FILES}/net`;
const STORAGE_FILES_UNZIP = `${STORAGE_FILES}/unzip`;
const STORAGE_FILES_ZIP = `${STORAGE_FILES}/zip`;
const STORAGE_FILES_ZIP_DOWNLOAD = `${STORAGE_FILES_ZIP}/download`;
const STORAGE_FILES_PROCESS = `${STORAGE_FILES}/process`;
const STORAGE_FILES_CODE = `${STORAGE_FILES}/code`;

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

    createZipToDownload(params: {
        path: string;
        divide_id?: number;
        time_zone?: number;
    }): Promise<void> {
        const timeZone = -new Date().getTimezoneOffset() / 60;
        params.time_zone ??= timeZone;

        return this.client.rest.post(STORAGE_FILES_ZIP_DOWNLOAD, params);
    }

    createZip(params: CreateZipRequestParams): Promise<void> {
        const timeZone = -new Date().getTimezoneOffset() / 60;
        params.time_zone ??= timeZone;

        return this.client.rest.post(STORAGE_FILES_ZIP, params);
    }

    cancelProcess(params: { process_id: string }): Promise<void> {
        return this.client.rest.delete(STORAGE_FILES_PROCESS, params);
    }

    unZip(params: UnZipRequestParams): Promise<void> {
        return this.client.rest.post(STORAGE_FILES_UNZIP, params);
    }

    checkZip(params: { code: string }): Promise<void> {
        return this.client.rest.head(STORAGE_FILES_CODE, params);
    }
}

export interface UploadNetRequestParams {
    path: string;
    url: string;
    overwrite?: boolean;
    divide_id?: number;
    connection_divide_id?: number;
}

export interface UnZipRequestParams {
    divide_id?: number;
    dst_divide_id?: number;
    dst_folder: string;
    dst_path: string;
    overwrite?: boolean;
    path: string;
}

export interface CreateZipRequestParams {
    dst_path: string;
    src_paths: string[];
    dst_divide_id?: number;
    src_divide_id?: number;
    time_zone?: number;
    overwrite?: boolean;
}
