import { StorageElement } from './storage';

export type StorageTrashElement = StorageElement & { del_group_id: number };

export type StorageTrashItem = Pick<
    StorageTrashElement,
    'del_group_id' | 'path'
>;
