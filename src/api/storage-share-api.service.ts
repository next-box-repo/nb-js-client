import { Api } from '../classes';
import { PermissionType, ShareInfo, ShareModel } from '../types';

const STORAGE_ELEMENT_SHARE = '/storage/element/share';

export class StorageShareApiService {
    constructor(private api: Api) {}

    info(path: string): Promise<ShareInfo> {
        return this.api.get(STORAGE_ELEMENT_SHARE, { path });
    }

    create(path: string, permissions_type: PermissionType): Promise<ShareInfo> {
        const data = {
            path,
            permissions_type,
        };

        return this.api.post(STORAGE_ELEMENT_SHARE, JSON.stringify(data));
    }

    change(data: ShareModel): Promise<ShareInfo> {
        return this.api.put(
            `${STORAGE_ELEMENT_SHARE}/${data.token}`,
            JSON.stringify(data),
        );
    }

    delete(path: string): Promise<void> {
        return this.api.delete(STORAGE_ELEMENT_SHARE, { path });
    }

    refresh(token: string): Promise<ShareInfo> {
        return this.api.put(`${STORAGE_ELEMENT_SHARE}/${token}/refresh`);
    }
}
