import { BASE_URL_V2, Client } from '../classes';
import {
    Extension,
    ExtensionDefault,
    ExtensionFileMode,
    ExtensionListParams,
    HttpEvent,
    NameExtensionListParams,
    OnUploadProgress,
    RequestBaseParams,
    ResponseItem,
    ResponseList,
    SettingValue,
    StorageElementType,
    UserNamesExtension,
} from '../types';

const EXTENSIONS = '/static/extensions';
const EXTENSIONS_DEFAULT = `/extensions/defaults`;
const EXTENSIONS_NAME_USER = `${EXTENSIONS}/names/users`;
const EXTENSIONS_NAME_SYSTEM = `${EXTENSIONS}/names/system`;

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

    list(params?: ExtensionListParams): Promise<ResponseList<Extension>> {
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
            version: BASE_URL_V2,
            onUploadProgress: (event) => {
                onProgress(event);
            },
        });

        return {
            promise,
            abort,
        };
    }

    install(uniq_key: string, version: string): Promise<any> {
        return this.client.rest.post(
            `${EXTENSIONS}/site`,
            {
                uniq_key,
                version,
            },
            { version: BASE_URL_V2 },
        );
    }

    getSystemNameExts(
        params?: NameExtensionListParams,
    ): Promise<ResponseList<string>> {
        return this.client.rest.get(EXTENSIONS_NAME_SYSTEM, params);
    }

    getUserNameExts(
        params?: NameExtensionListParams,
    ): Promise<ResponseList<UserNamesExtension>> {
        return this.client.rest.get(EXTENSIONS_NAME_USER, params);
    }

    createUserNameExt(name: string): Promise<void> {
        return this.client.rest.post(`${EXTENSIONS_NAME_USER}`, { name });
    }

    deleteUserNameExt(name: string): Promise<void> {
        return this.client.rest.delete(`${EXTENSIONS_NAME_USER}/${name}`);
    }

    deleteAllUserNameExts(): Promise<void> {
        return this.client.rest.delete(`${EXTENSIONS_NAME_USER}`);
    }
}
