export interface Tag {
    id: number;
    create_date: string;
    update_date: string;
    type: TagTypes;
    name: string;
    // count?: number;
    // added?: boolean;
}

export enum TagTypes {
    Critical = 'critical',
    Brand = 'brand',
    Black = 'black',
    Success = 'success',
    Purple = 'purple',
    Yellow = 'yellow',
    Warning = 'warning',
    Hidden = 'hidden',
}

export interface AssignTagItemParam {
    file_id: string;
    divide_id?: number;
}
