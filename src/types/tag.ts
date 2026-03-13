export interface Tag {
    create_date?: string;
    id?: number;
    name: string;
    type: TagTypes;
    update_date?: string;
}

export interface AssignTagItemParam {
    file_container_id: string;
    divide_id: number;
    file_owner_id: number;
}

export enum TagTypes {
    Yellow = 'yellow',
    Success = 'success',
    Critical = 'critical',
    Warning = 'warning',
    Brand = 'brand',
    Purple = 'purple',
    Primary = 'primary',
}
