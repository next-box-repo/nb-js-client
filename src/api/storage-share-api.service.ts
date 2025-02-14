import { Client } from '../classes';
import { PermissionType, ShareInfo, ShareModel } from '../types';

const STORAGE_ELEMENT_SHARE = '/storage/element/share';

export class StorageShareApiService {
    constructor(private client: Client) {}

    info(path: string): Promise<ShareInfo> {
        return this.client.rest.get(STORAGE_ELEMENT_SHARE, { path });
    }

    create(path: string, permissions_type: PermissionType): Promise<ShareInfo> {
        const data = {
            path,
            permissions_type,
        };

        return this.client.rest.post(
            STORAGE_ELEMENT_SHARE,
            JSON.stringify(data),
        );
    }

    change(data: ShareModel): Promise<ShareInfo> {
        return this.client.rest.put(
            `${STORAGE_ELEMENT_SHARE}/${data.token}`,
            JSON.stringify(data),
        );
    }

    delete(path: string): Promise<void> {
        return this.client.rest.delete(STORAGE_ELEMENT_SHARE, { path });
    }

    refresh(token: string): Promise<ShareInfo> {
        return this.client.rest.put(
            `${STORAGE_ELEMENT_SHARE}/${token}/refresh`,
        );
    }
}
