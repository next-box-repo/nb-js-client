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

export enum SpacePermission {
    Read = 'r',
    Write = 'rw',
    ReadWriteDelete = 'rwd',
    SpaceManage = 'space_manage',
}

export interface SpaceAccess {
    access_mode: SpacePermission;
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
