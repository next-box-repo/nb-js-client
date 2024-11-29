import { RequestBaseParams } from './base';
import { PermissionType } from './divide';
import { User } from './user';

export interface RequestStorageListParams extends RequestBaseParams {
    search?: string;
    is_favorite?: boolean;
    is_divided?: boolean;
    divide_id?: number | null;
    path?: string;
    min_size?: number | null;
    max_size?: number | null;
    type?: StorageElementType;
    file_name_ext?: string[];
    from_sharing_token?: string;
    from_path?: string;
    from_sharing_password?: string;
}

export interface StorageElementCreate {
    is_work_dir?: boolean;
    created_by_extension?: string;
    divide_id?: number;
    name: string;
    type: StorageElementType;
    path: string;
}

export enum StorageElementType {
    Dir = 'dir',
    File = 'file',
    WorkDir = 'work_dir',
}

export interface StorageElement {
    name: string;
    size: number;
    shared: boolean;
    full_path: string;
    path: string;
    type: StorageElementType;
    file_name_ext: string;
    content_type: StorageElementContentType;
    update_date: string;
    create_date: string;
    with_preview: boolean;
    is_favorite: boolean;
    owner: User;
    owner_id: number;
    version?: StorageElementVersion;
    divide_id?: number;
    access_mode?: PermissionType;
    to_user_group_name?: string;
    created_by_extension?: string;
}

export enum StorageElementContentType {
    Any = 'any',
    Dir = 'dir',
    Code = 'code',
    Image = 'image',
    Audio = 'audio',
    Video = 'video',
    Text = 'text',
    Doc = 'doc',
    Xls = 'xls',
    Ppt = 'ppt',
}

export interface StorageElementVersion {
    id: string;
    size: number;
    user_id: number;

    name: string;
    description: string;
    create_date: string;
    update_date: string;

    is_current_version: boolean;
}

export interface StorageElementHistory {
    user_id: number;
    action: StorageElementHistoryAction;
    create_date: string;
}

export enum StorageElementHistoryAction {
    Create = 'create',
    Update = 'update',
    Move = 'move',
}

export interface StorageElementPaste {
    from_path: string;
    to_path: string;
}

export interface QueryParamsToPaste {
    paths: StorageElementPaste[];
    overwrite: boolean;
    from_divide_id?: number | null;
    to_divide_id?: number | null;
}

export interface HistoryNote {
    name: string;
    description: string;
    divide_id: number | null;
    file_version_id: string;
    path: string;
}

export interface UploadNetRequestParams {
    path: string;
    url: string;
    overwrite?: boolean;
    divide_id?: number;
}
