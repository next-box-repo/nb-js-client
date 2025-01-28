import { Client } from '../classes';
import {
    RequestStorageListParams,
    ResponseList,
    StorageTrashElement,
    StorageTrashItem,
} from '../types';

const STORAGE_TRASH = '/storage/trash';
const STORAGE_TRASH_ELEMENT = `${STORAGE_TRASH}/element`;
const STORAGE_TRASH_ELEMENT_ALL = `${STORAGE_TRASH_ELEMENT}/all`;

export class StorageTrashApi {
    constructor(private client: Client) {}

    list(
        params: RequestStorageListParams,
    ): Promise<ResponseList<StorageTrashElement>> {
        return this.client.rest.get(STORAGE_TRASH, params);
    }

    clear(item: StorageTrashItem): Promise<void> {
        return this.client.rest.delete(STORAGE_TRASH_ELEMENT, item);
    }

    clearAll(): Promise<void> {
        return this.client.rest.delete(STORAGE_TRASH_ELEMENT_ALL);
    }

    restore(del_groups: StorageTrashItem[]): Promise<void> {
        return this.client.rest.patch(
            STORAGE_TRASH_ELEMENT,
            JSON.stringify({ del_groups }),
        );
    }
}
