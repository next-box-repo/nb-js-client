import { Client } from '../classes';
import {
    Extension,
    ExtensionDefault,
    ExtensionFileMode,
    HttpEvent,
    OnUploadProgress,
    RequestBaseParams,
    ResponseItem,
    ResponseList,
    SettingValue,
    StorageElementType,
} from '../types';

const EXTENSION = '/static/extensions';
const EXTENSION_DEFAULT = `/extensions/defaults`;

export class ExtensionsApiService {
    constructor(private client: Client) {}

    getSetting(uniqKey: string): Promise<SettingValue[]> {
        return this.client.rest.get(`${EXTENSION}/${uniqKey}/settings`);
    }

    setSetting(uniqKey: string, params: SettingValue[]): Promise<void> {
        return this.client.rest.post(
            `${EXTENSION}/${uniqKey}/settings`,
            JSON.stringify(params),
        );
    }

    deleteSetting(uniqKey: string): Promise<void> {
        return this.client.rest.delete(`${EXTENSION}/${uniqKey}/settings`);
    }

    get(id: number): Promise<ResponseItem<Extension>> {
        return this.client.rest.get(`${EXTENSION}/${id}`);
    }

    getByKey(uniqKey: string): Promise<ResponseItem<Extension | null>> {
        return this.client.rest.get(`${EXTENSION}/${uniqKey}`);
    }

    getDefault(
        ext_code: string[] = [],
    ): Promise<ResponseList<ExtensionDefault>> {
        return this.client.rest.get(EXTENSION_DEFAULT, { ext_code });
    }

    setDefault(
        ext_code: string,
        ext_uniq_key: string,
    ): Promise<ExtensionDefault> {
        return this.client.rest.post(
            EXTENSION_DEFAULT,
            JSON.stringify({ ext_code, ext_uniq_key }),
        );
    }

    checkUpdates(): Promise<void> {
        return this.client.rest.post('/static/extensions/check_updates');
    }

    updateVersion(id: number, version: string): Promise<Extension> {
        return this.client.rest.put(
            `/static/extensions/${id}`,
            JSON.stringify({ version }),
        );
    }

    list(
        params?: ExtensionListParams,
    ): Promise<ResponseList<Extension & { with_settings: boolean }>> {
        return this.client.rest.get(EXTENSION, params);
    }

    delete(id: number, name: string): Promise<void> {
        return this.client.rest.delete(`${EXTENSION}/${id}`);
    }

    upload(
        onProgress: OnUploadProgress,
        file: File,
    ): Promise<HttpEvent<ResponseItem<Extension>>> {
        const form = new FormData();
        form.set('file', file);

        return this.client.rest.post(EXTENSION, form, {
            onUploadProgress: (event) => {
                onProgress(event);
            },
        });
    }

    install(uniq_key: string, version: string): Promise<any> {
        return this.client.rest.post(
            '/static/extensions/site',
            JSON.stringify({ uniq_key, version }),
        );
    }
}

export interface ExtensionListParams extends RequestBaseParams {
    search?: string | null;
    uniq_key?: string[];
    file_name_ext?: string;
    type?: StorageElementType[];
    ext_value?: string | null;
    file_mode?: ExtensionFileMode[];
    lang?: string;
}
