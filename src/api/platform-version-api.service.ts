import { Client } from '../classes';
import { ResponseItem } from '../types';
import { PlatformVersions } from '../types/platform-version';

const VERSION = '/version';
export class PlatformVersionApiService {
    constructor(private client: Client) {}

    getVersions(params?: any): Promise<ResponseItem<PlatformVersions>> {
        return this.client.rest.get(VERSION, params);
    }
}
