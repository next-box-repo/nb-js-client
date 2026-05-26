import { ColorTypes } from './base';

export interface Tag {
    create_date?: string;
    id?: number;
    name: string;
    type: ColorTypes;
    update_date?: string;
}

export interface AssignTagItemParam {
    file_container_id: string;
    divide_id: number;
    file_owner_id: number;
}
