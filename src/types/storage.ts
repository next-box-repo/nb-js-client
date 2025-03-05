import { RequestBaseParams } from './base';
import { PermissionType } from './divide';
import { User } from './user';

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
    owner_id: number;
    version?: StorageElementVersion;
    divide_id?: number;
    access_mode?: PermissionType;
    to_user_group_id?: number;
    created_by_extension?: string;
    check_status?: StorageElementCheckStatus;
}

export enum StorageElementType {
    Dir = 'dir',
    File = 'file',
    WorkDir = 'work_dir',
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

export enum StorageRoot {
    my = 'my',
    fca = 'fca',
    divide = 'divide',
    share = 'share',
    favorite = 'favorite',
}

export interface StorageRouteData {
    path: string;
    root: StorageRoot;
    rootId: number;
    divideDir?: string;
    share_token?: string;
    share_password?: string;
    share_back?: boolean;
    dash_back?: boolean;
    access_mode?: PermissionType;
    file_version_id?: string;
}

export interface StorageElementPaste {
    from_path: string;
    to_path: string;
}

export interface StorageElementHistory {
    user_id: number;
    action: StorageElementHistoryAction;
    create_date: string;
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

export enum StorageElementHistoryAction {
    Create = 'create',
    Update = 'update',
    Move = 'move',
}

export interface HistoryNote {
    name: string;
    description: string;
    divide_id: number | null;
    file_version_id: string;
    path: string;
}

export enum StorageElementCheckStatus {
    CheckNull,
    CheckInProgress,
    CheckPositive,
    CheckNegative,
}

export interface RequestVersionsSizeParams {
    path: string;
    divide_id?: number;
}

export interface StorageInstance {
    disk_id: string;
    disk_size: number;
    free_size: number;
    instance_number: number;
    quota_size_config: number;
    quota_size_setting: number;
    used_size: number;
}

export interface SizeBySection {
    content_type: string;
    size: number;
    count: number;
    label: string;
}
