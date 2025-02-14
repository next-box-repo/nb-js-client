import { Client } from '../classes';
import {
    ExtensionExternal,
    ExtensionExternalInList,
    RequestBaseParams,
    ResponseList,
    ResponseType,
} from '../types';

export class ExtensionsExternalApiService {
    constructor(private client: Client) {}

    listExtensionsSite(
        params: ExtensionExternalListParams,
    ): Promise<ResponseList<ExtensionExternalInList>> {
        return this.client.rest.get('/anons_ext/extensions', params);
    }

    extensionDetailSite(uniqKey: string): Promise<ExtensionExternal> {
        return this.client.rest.get(`/anons_ext/extensions/${uniqKey}`);
    }

    extensionMarkdown(
        uniqKey: string,
        config: { responseType: ResponseType },
    ): Promise<string> {
        return this.client.rest.get(
            `/anons_ext/extensions/${uniqKey}/readme`,
            {},
            config,
        );
    }
}

export interface ExtensionExternalListParams extends RequestBaseParams {
    search_field?: string;
}
