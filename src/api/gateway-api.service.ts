import { Client } from '../classes';
import { QueryInit, Setting, SettingValue } from '../types';

export class GatewayApi {
    constructor(private client: Client) {}

    settings(): Promise<Setting[]> {
        return this.client.rest.get('/settings');
    }

    changeSettings(data: SettingValue[]): Promise<void> {
        return this.client.rest.post('/settings', JSON.stringify(data));
    }

    queryInit(): Promise<QueryInit> {
        return this.client.rest.get('/query/init');
    }
}
