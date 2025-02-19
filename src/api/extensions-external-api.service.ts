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
        return this.client.rest.changeHost('https://next-box.ru', () => {
            return this.client.rest.get(EXTENSIONS, params);
        });
    }

    extensionDetailSite(uniqKey: string): Promise<ExtensionExternal> {
        return this.client.rest.changeHost('https://next-box.ru', () => {
            return this.client.rest.get(`${EXTENSIONS}/${uniqKey}`);
        });
    }

    extensionMarkdown(
        uniqKey: string,
        config: { responseType: ResponseType },
    ): Promise<string> {
        return this.client.rest.changeHost('https://next-box.ru', () => {
            return this.client.rest.get(
                `${EXTENSIONS}/${uniqKey}/readme`,
                {},
                config,
            );
        });
    }
}

export interface ExtensionExternalListParams extends RequestBaseParams {
    search_field?: string;
}
