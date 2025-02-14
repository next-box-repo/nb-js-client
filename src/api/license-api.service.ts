import { Client } from '../classes';
import { ChangeLicenseParams, License } from '../types';

const LICENSE = '/license';
const CHECK_LICENSE = `${LICENSE}/manual-check`;
const HASH = `${LICENSE}/hardware/hash`;

export class LicenseApiService {
    constructor(private client: Client) {}

    info(): Promise<License> {
        return this.client.rest.get(LICENSE);
    }

    create(data: ChangeLicenseParams): Promise<License> {
        return this.client.rest.post(LICENSE, JSON.stringify(data));
    }

    check(): Promise<License> {
        return this.client.rest.post(CHECK_LICENSE);
    }

    delete(): Promise<void> {
        return this.client.rest.delete(LICENSE);
    }

    getHash(): Promise<{ hash: string }> {
        return this.client.rest.get(HASH);
    }
}
