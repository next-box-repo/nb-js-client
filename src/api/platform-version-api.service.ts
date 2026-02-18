import { Client } from '../classes';
import { ResponseItem } from '../types';
import { PlatformVersions } from '../types/platform-version';

const VERSION = '/version';
const VERSION_CHANGELOG = `${VERSION}/changelog`
export class PlatformVersionApiService {
    constructor(private client: Client) {}

    getVersions(params?: any): Promise<ResponseItem<PlatformVersions>> {
        return this.client.rest.get(VERSION, params);
    }

    getChangelog(version_number?: string): Promise<string> {
        return this.client.rest.get(VERSION_CHANGELOG, { version_number })
    }
}
