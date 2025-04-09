import { Client } from '../classes';
import { StorageTrashItem } from '../types';

const STORAGE_TRASH = '/storage/trash';
const STORAGE_TRASH_ELEMENT = `${STORAGE_TRASH}/element`;
const STORAGE_TRASH_ELEMENT_ALL = `${STORAGE_TRASH_ELEMENT}/all`;

export class StorageTrashApiService {
    constructor(private client: Client) {}

    clear(item: StorageTrashItem): Promise<void> {
        return this.client.rest.delete(STORAGE_TRASH_ELEMENT, item);
    }

    clearAll(): Promise<void> {
        return this.client.rest.delete(STORAGE_TRASH_ELEMENT_ALL);
    }

    restore(del_groups: StorageTrashItem[]): Promise<void> {
        return this.client.rest.patch(STORAGE_TRASH_ELEMENT, { del_groups });
    }

    restoreAll(): Promise<void> {
        return this.client.rest.patch(STORAGE_TRASH_ELEMENT_ALL);
    }
}
