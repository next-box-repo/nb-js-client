import { Api } from '../classes';
import { ResponseItem, StorageElement, UploadNetRequestParams } from '../types';

const STORAGE_FILES = '/storage/files';
const STORAGE_FILES_NET = `${STORAGE_FILES}/net`;

export class StorageFilesApiService {
    constructor(private api: Api) {}

    read(path: string, params: any): Promise<ResponseItem<any>> {
        params['path'] = path;

        return this.api.get(STORAGE_FILES, params);
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

        return this.api.put(`${STORAGE_FILES}?${search.toString()}`, data);
    }

    upload(
        file: File,
        path: string,
        divide_id?: number,
    ): Promise<ResponseItem<StorageElement>> {
        const form = new FormData();

        form.set('path', path);
        form.set('file', file);

        if (divide_id) form.set('divide_id', divide_id.toString());

        return this.api.post(STORAGE_FILES, form);
    }

    uploadNet(
        data: UploadNetRequestParams,
    ): Promise<ResponseItem<StorageElement>> {
        return this.api.post(STORAGE_FILES_NET, JSON.stringify(data));
    }
}