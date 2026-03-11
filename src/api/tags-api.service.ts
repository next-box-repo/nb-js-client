import { Client } from '../classes';
import { AssignTagItemParam, Tag } from '../types';

const TAG = '/tag';
const TAG_LIST = `${TAG}/list`;

export class TagsApiService {
    constructor(private client: Client) {}

    list(params?: RequestTagParams): Promise<Tag[]> {
        return this.client.rest.get(TAG_LIST, params);
    }

    assign(id: number, items: AssignTagItemParam[]): Promise<void> {
        return this.client.rest.post(`${TAG}/${id}/assign`, { items });
    }

    unassign(id: number, items: AssignTagItemParam[]): Promise<void> {
        return this.client.rest.post(`${TAG}/${id}/unassign`, { items });
    }
}

export interface RequestTagParams {
    search?: string;
}
