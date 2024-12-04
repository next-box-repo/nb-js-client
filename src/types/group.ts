import { RequestBaseParams } from './base';
import { UserLabel } from './user';

export interface Group {
    id: number;
    name: string;
    description: string;
    amount_users: number;
    create_date: string;
    owner_id: number;
    owner: UserLabel;
    update_date: string;
    icon: string;
    icon_color: string;
}

export interface RequestGroupListParams extends RequestBaseParams {
    id?: number[];
    name?: string;
    description?: string;
    search_field?: string;
}

export type CreateGroupParams = Pick<Group, 'name' | 'description'> & {
    users?: number[];
};
