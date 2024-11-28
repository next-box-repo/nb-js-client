import { Lang } from './base';

export interface Permission {
    group_name: Lang;
    permissions: PermissionItem[];
}

export interface PermissionItem {
    id: number;
    priority: number;
    title: Lang;
}
