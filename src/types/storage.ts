import { RequestBaseParams } from './base';
import { PermissionType, RestrictionStatus } from './divide';
import { User } from './user';

export interface StorageElement {
    access_mode?: PermissionType;
    available: boolean;
    check_status?: StorageElementCheckStatus;
    content_type: StorageElementContentType;
    create_date: string;
    created_by_extension?: string;
    del_group_id: number;
    divide_id?: number;
    file_name_ext: string;
    full_path: string;

    is_favorite: boolean;
    last_used_extension: string;
    name: string;
    owner_id: number;
    path: string;
    shared: boolean;
    type: StorageElementType;
    update_date: string;
    with_preview: boolean;
    size: number;
    id?: string;
    version?: StorageElementVersion;
    to_user_group_id?: number;
}

export type StorageDivideElement = Pick<
    StorageElement,
    'access_mode' | 'create_date' | 'name' | 'owner_id' | 'type' | 'update_date'
> & {
    comment: string;
    id: number;
    moderator_id: number;
    resource: string;
    restriction_status: RestrictionStatus;
    to_user_group_id: number;
    to_user_id: number;
};

export type StorageSharingElement = Pick<
    StorageElement,
    'access_mode' | 'create_date' | 'name' | 'update_date'
> & {
    comment: string;
    expire_delta: number;
    expire_in: string;
    id: number;
    element_name: string;
    moderator_id: number;
    restriction_status: RestrictionStatus;
    share_sub_type: StorageElementType;
    short_url: string;
    token: string;
    with_password: boolean;
};

export interface StorageElementFileInfo {
    file_info: StorageElement | null;
    divide_info: StorageDivideElement | null;
    sharing_info: StorageSharingElement | null;
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
    trash = 'trash',
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
    editor?: string;
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
    create_date: string;
    description: string;
    id: string;
    is_current_version: boolean;
    name: string;
    size: number;
    user_id: number;
    update_date: string;
}

export interface StorageElementVersionLock {
    lock_begin: string;
    timeout: number;
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
