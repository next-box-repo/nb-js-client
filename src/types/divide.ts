import { ResponseList } from './base';
import { StorageElementType } from './storage';

export enum DivideScope {
    Storage = '/storage/element',
    Connection = '/connections',
}

export type DivideResourceType = string | number;

export enum PermissionType {
    CLOSE = '',
    READ = 'r',
    WRITE = 'rw',
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
}

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

export interface ShareSetting {
    share_token: string;
    share_pass: string;
    access_mode: PermissionType;
    path: string;
}

export interface ShareModel {
    token: string;
    access_mode: PermissionType;
    password: string | null;
    expire_delta: number | null;
}
