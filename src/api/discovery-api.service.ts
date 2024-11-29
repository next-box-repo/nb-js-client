import { Api } from '../classes';
import { ResponseList } from '../types';
import { Discovery } from '../types/discovery';

export class DiscoveryApiService {
    constructor(private api: Api) {}

    discovery(params?: any): Promise<ResponseList<Discovery>> {
        return this.api.get('/discovery', params);
    }
}
