import { Lang } from './base';

export interface Permission {
    group_name: Lang;
    permissions: PermissionItem[];
    group_description?: Lang;
}

export interface PermissionItem {
    id: number;
    priority: number;
    title: Lang;
}
