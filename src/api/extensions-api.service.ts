import { BASE_URL_V2, Client } from '../classes';
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

const EXTENSIONS = '/static/extensions';
const EXTENSIONS_DEFAULT = `/extensions/defaults`;

export class ExtensionsApiService {
    constructor(private client: Client) {}

    getSetting(uniqKey: string): Promise<SettingValue[]> {
        return this.client.rest.get(`${EXTENSIONS}/${uniqKey}/settings`);
    }

    setSetting(uniqKey: string, params: SettingValue[]): Promise<void> {
        return this.client.rest.post(
            `${EXTENSIONS}/${uniqKey}/settings`,
            params,
        );
    }

    deleteSetting(uniqKey: string): Promise<void> {
        return this.client.rest.delete(`${EXTENSIONS}/${uniqKey}/settings`);
    }

    get(id: number): Promise<ResponseItem<Extension>> {
        return this.client.rest.get(`${EXTENSIONS}/${id}`);
    }

    getByKey(uniqKey: string): Promise<ResponseItem<Extension | null>> {
        return this.client.rest.get(`${EXTENSIONS}/${uniqKey}`);
    }

    getDefault(
        ext_code: string[] = [],
    ): Promise<ResponseList<ExtensionDefault>> {
        return this.client.rest.get(EXTENSIONS_DEFAULT, { ext_code });
    }

    setDefault(
        ext_code: string,
        ext_uniq_key: string,
    ): Promise<ExtensionDefault> {
        return this.client.rest.post(EXTENSIONS_DEFAULT, {
            ext_code,
            ext_uniq_key,
        });
    }

    checkUpdates(): Promise<void> {
        return this.client.rest.post(`${EXTENSIONS}/check_updates`);
    }

    updateVersion(id: number, version: string): Promise<Extension> {
        return this.client.rest.put(`${EXTENSIONS}/${id}`, { version });
    }

    list(
        params?: ExtensionListParams,
    ): Promise<ResponseList<Extension & { with_settings: boolean }>> {
        return this.client.rest.get(EXTENSIONS, params);
    }

    delete(id: number, name: string): Promise<void> {
        return this.client.rest.delete(`${EXTENSIONS}/${id}`);
    }

    upload(
        onProgress: OnUploadProgress,
        file: File,
    ): {
        promise: Promise<HttpEvent<ResponseItem<Extension>>>;
        abort: () => void;
    } {
        const form = new FormData();
        form.set('file', file);

        const { promise, abort } = this.client.rest.upload(EXTENSIONS, form, {
            onUploadProgress: (event) => {
                onProgress(event);
            },
        });

        return {
            promise: this.client.rest.changeBaseUrlVersion(
                BASE_URL_V2,
                () => promise,
            ),
            abort,
        };
    }

    install(uniq_key: string, version: string): Promise<any> {
        return this.client.rest.changeBaseUrlVersion(BASE_URL_V2, () => {
            return this.client.rest.post(`${EXTENSIONS}/site`, {
                uniq_key,
                version,
            });
        });
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
