import { PermissionType } from './divide';

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

export interface SpaceAdmin {
    id: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    login?: string;
    middle_name?: string;
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
