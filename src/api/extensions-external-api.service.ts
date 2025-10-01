import { Client } from '../classes';
import {
    ExtensionExternal,
    ExtensionExternalInList,
    RequestBaseParams,
    ResponseList,
    ResponseType,
} from '../types';

const EXTENSIONS = '/anons_ext/extensions';

export class ExtensionsExternalApiService {
    constructor(private client: Client) {}

    listExtensionsSite(
        params: ExtensionExternalListParams,
    ): Promise<ResponseList<ExtensionExternalInList>> {
        return this.client.rest.get(EXTENSIONS, params, {
            host: 'https://next-box.ru',
        });
    }

    extensionDetailSite(uniqKey: string): Promise<ExtensionExternal> {
        return this.client.rest.get(
            `${EXTENSIONS}/${uniqKey}`,
            {},
            { host: 'https://next-box.ru' },
        );
    }

    extensionMarkdown(
        params: ExtensionExternalReadmeParams,
        config: { responseType: ResponseType },
    ): Promise<string> {
        return this.client.rest.get(
            `${EXTENSIONS}/${params.uniqKey}/readme`,
            { lang: params.lang },
            { ...config, host: 'https://next-box.ru' },
        );
    }
}

export interface ExtensionExternalReadmeParams {
    uniqKey: string;
    lang: string;
}

export interface ExtensionExternalListParams extends RequestBaseParams {
    lang: string;
    search_field?: string;
}
