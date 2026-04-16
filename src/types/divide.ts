import { RequestBaseParams, ResponseList } from './base';
import {
    StorageElement,
    StorageElementContentType,
    StorageElementType,
} from './storage';
import { TagTypes } from './tag';
import { UserInfo } from './user';

export enum DivideScope {
    Storage = '/storage/element',
    Connection = '/connections',
}

export type DivideResourceType = string | number;

export enum PermissionType {
    Close = '',
    Read = 'r',
    Write = 'rw',
    Full = 'full',
    Admin = 'admin',
}

export enum RestrictionStatus {
    WAITING = 'waiting',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum RestrictionBooleanStatus {
    TRUE = 'true',
    FALSE = 'false',
}

export enum DivideMode {
    User = 'to_user_id',
    Group = 'to_user_group_id',
}

export interface ShareInfo extends DivideParams {
    id: number;
    token: string;
    access_mode: PermissionType;
    expire_delta: number | null;
    expire_in?: string;
    with_password: boolean;
    share_sub_type: StorageElementType;
    create_date: string;
    update_date: string;
    owner_id: number;
    resource: string;
    file_info: StorageElement;
    short_url: string;
    comment: string;
    comment_date?: string;
}

export interface UnionRestriction extends UserDivide, ShareInfo {}
export interface UserDivide extends DivideParams {
    access_mode: PermissionType;
    create_date: string;
    id: number;
    name: string;
    owner_id: number;
    resource: string;
    to_user_group_id: number;
    to_user_id: number;
    type: StorageElementType;
    update_date: string;
    file_info: StorageElement;
}

export enum RestrictionModeKey {
    Divide = 'divide',
    Share = 'share',
}

interface DivideParams {
    restriction_status: RestrictionStatus;
    moderator_id?: number;
    comment: string;
}

export interface RequestUserDivideParams {
    is_to_user_group: boolean;
    access_mode?: PermissionType;
    limit?: number;
    offset?: number;
    search_field?: string;
}

export type DivideResponseList = ResponseList<UserDivide> & {
    total_r: number;
    total_rw: number;
};

export interface ShareModel {
    token: string;
    access_mode: PermissionType;
    password: string | null;
    expire_delta: number | null;
}

export interface DivideResourceParams extends RequestBaseParams {
    path: string;
    access_mode?: PermissionType;
    divide_id?: number;
    search?: string;
    with_owner?: boolean;
}

export interface ResourceAccess {
    id: number;
    access_mode: string;
    comment: string;
    create_date: string;
    update_date: string;
    moderator_id: number;
    owner_id: number;
    relative_path: string;
    resource: string;
    restriction_status: string;
    to_user_group_id: number;
    to_user_id: number;
    type: string;
    user_info: UserInfo;
}

export interface RequestTagGroupsParams extends RequestBaseParams {
    access_mode?: PermissionType;
    content_types?: StorageElementContentType[];
    from_user_id?: number;
    from_user_ids?: number[];
    min_size?: number;
    max_size?: number;
    search?: string;
    show_hidden?: boolean;
    status?: RestrictionStatus;
    tag_ids?: number[];
    to_user_group_ids?: number;
    type?: StorageElementType;
    without_tags?: boolean;
}

export interface TagGroup {
    count: number;
    tag_id: number;
    tag_name: string;
    tag_type: TagTypes;
}
