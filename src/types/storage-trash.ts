import { StorageElementContentType, StorageElementType } from './storage';

export interface StorageTrashElement {
    content_type: StorageElementContentType;
    del_group_id: number;
    file_name_ext: string;
    full_path: string;
    name: string;
    path: string;
    size: number;
    type: StorageElementType;
    update_date: string;
    version: VersionStorageTrashElement;
    with_preview: boolean;
}

interface VersionStorageTrashElement {
    create_date: string;
    description: string;
    id: string;
    name: string | null;
    size: number;
    update_date: string;
    user_id: number;
}

export type StorageTrashItem = Pick<
    StorageTrashElement,
    'del_group_id' | 'path'
>;
