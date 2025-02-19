import { Client } from '../classes';
import { ResponseList } from '../types';
import { Discovery } from '../types/discovery';

const DISCOVERY = '/discovery';
export class DiscoveryApiService {
    constructor(private client: Client) {}

    discovery(params?: any): Promise<ResponseList<Discovery>> {
        return this.client.rest.get(DISCOVERY, params);
    }
}
