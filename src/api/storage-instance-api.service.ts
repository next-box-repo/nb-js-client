import { Client } from '../classes';
import { ResponseList, StorageInstance } from '../types';

const STORAGE_INSTANCE = 'storage/instance';

export class StorageInstanceApiService {
    constructor(private client: Client) {}

    instance(): Promise<ResponseList<StorageInstance>> {
        return this.client.rest.get(STORAGE_INSTANCE);
    }
}
