import { Client } from '../classes';
import {
    ExtensionExternal,
    ExtensionExternalInList,
    ExtensionExternalListParams,
    ResponseList,
} from '../types';

export class ExtensionsExternalApi {
    constructor(private client: Client) {}

    listExtensionsSite(
        params: ExtensionExternalListParams,
    ): Promise<ResponseList<ExtensionExternalInList>> {
        return this.client.rest.get('/anons_ext/extensions', params);
    }

    extensionDetailSite(uniqKey: string): Promise<ExtensionExternal> {
        return this.client.rest.get(`/anons_ext/extensions/${uniqKey}`);
    }

    extensionMarkdown(uniqKey: string): Promise<string> {
        return this.client.rest.get(`/anons_ext/extensions/${uniqKey}/readme`);
    }
}
