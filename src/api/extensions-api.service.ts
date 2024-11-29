import { Api } from '../classes';
import {
    Extension,
    ExtensionDefault,
    ExtensionListParams,
    ResponseItem,
    ResponseList,
    SettingValue,
} from '../types';

const EXTENSION = '/static/extensions';
const EXTENSION_DEFAULT = `/extensions/defaults`;

export class ExtensionsApiService {
    constructor(private api: Api) {}

    getSetting(uniqKey: string): Promise<SettingValue[]> {
        return this.api.get(`${EXTENSION}/${uniqKey}/settings`);
    }

    setSetting(uniqKey: string, params: SettingValue[]): Promise<void> {
        return this.api.post(
            `${EXTENSION}/${uniqKey}/settings`,
            JSON.stringify(params),
        );
    }

    deleteSetting(uniqKey: string): Promise<void> {
        return this.api.delete(`${EXTENSION}/${uniqKey}/settings`);
    }

    get(id: number): Promise<ResponseItem<Extension>> {
        return this.api.get(`${EXTENSION}/${id}`);
    }

    getByKey(uniqKey: string): Promise<ResponseItem<Extension | null>> {
        return this.api.get(`${EXTENSION}/${uniqKey}`);
    }

    getDefault(
        ext_code: string[] = [],
    ): Promise<ResponseList<ExtensionDefault>> {
        return this.api.get(EXTENSION_DEFAULT, { ext_code });
    }

    setDefault(
        ext_code: string,
        ext_uniq_key: string,
    ): Promise<ExtensionDefault> {
        return this.api.post(
            EXTENSION_DEFAULT,
            JSON.stringify({ ext_code, ext_uniq_key }),
        );
    }

    checkUpdates(): Promise<void> {
        return this.api.post('/static/extensions/check_updates');
    }

    updateVersion(id: number, version: string): Promise<Extension> {
        return this.api.put(
            `/static/extensions/${id}`,
            JSON.stringify({ version }),
        );
    }

    list(
        params?: ExtensionListParams,
    ): Promise<ResponseList<Extension & { with_settings: boolean }>> {
        return this.api.get(EXTENSION, params);
    }

    delete(id: number, name: string): Promise<void> {
        return this.api.delete(`${EXTENSION}/${id}`);
    }

    upload(file: File): Promise<ResponseItem<Extension>> {
        const form = new FormData();
        form.set('file', file);

        return this.api.post(EXTENSION, form);
    }

    install(uniq_key: string, version: string): Promise<any> {
        return this.api.post(
            '/static/extensions/site',
            JSON.stringify({ uniq_key, version }),
        );
    }
}
