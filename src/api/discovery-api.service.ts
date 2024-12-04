import { Client } from '../classes';
import { ResponseList } from '../types';
import { Discovery } from '../types/discovery';

export class DiscoveryApiService {
    constructor(private client: Client) {}

    discovery(params?: any): Promise<ResponseList<Discovery>> {
        return this.client.rest.get('/discovery', params);
    }
}
