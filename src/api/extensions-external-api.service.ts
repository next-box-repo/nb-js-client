import { Api } from '../classes';
import {
    ExtensionExternal,
    ExtensionExternalInList,
    ExtensionExternalListParams,
    ResponseList,
} from '../types';

export class ExtensionsExternalApiService {
    constructor(private api: Api) {}

    listExtensionsSite(
        params: ExtensionExternalListParams,
    ): Promise<ResponseList<ExtensionExternalInList>> {
        return this.api.get('/anons_ext/extensions', params);
    }

    extensionDetailSite(uniqKey: string): Promise<ExtensionExternal> {
        return this.api.get(`/anons_ext/extensions/${uniqKey}`);
    }

    extensionMarkdown(uniqKey: string): Promise<string> {
        return this.api.get(`/anons_ext/extensions/${uniqKey}/readme`);
    }
}
