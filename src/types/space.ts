import { PermissionType } from './divide';
import { StorageElement } from './storage';
import { User } from './user';

export interface Space {
    can_manage?: boolean;
    create_date: string;
    icon: string;
    icon_color: string;
    id: number;
    name: string;
    owner_id: number;
    update_date: string;
    updated_by: number;
}

export interface SpaceAccess {
    access_mode: PermissionType;
    to_user_group_id?: number;
    to_user_id?: number;
}

export interface SpaceAccessProvide {
    access_mode: PermissionType;
    create_date: string;
    id: number;
    space_id: number;
    to_user_group_id?: number;
    to_user_id?: number;
    update_date: string;
}

export type SpaceAdmin = Pick<
    User,
    'id' | 'email' | 'first_name' | 'last_name' | 'login' | 'middle_name'
>;

export type SpaceElement = Pick<
    StorageElement,
    | 'access_mode'
    | 'content_type'
    | 'create_date'
    | 'created_by_extension'
    | 'del_group_id'
    | 'file_name_ext'
    | 'last_used_extension'
    | 'name'
    | 'size'
    | 'type'
    | 'update_date'
    | 'with_preview'
    | 'id'
> & {
    created_by: number;
    parent_id: number;
    space_id: number;
    updated_by: number;
};
