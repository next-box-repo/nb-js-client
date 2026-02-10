import { Client } from '../classes';
import { AssignTagItemParam, Tag, TagTypes } from '../types/tags';

const TAGS = '/tags';

export class TagsApiService {
    constructor(private client: Client) {}

    list(data: { search?: string }): Promise<Tag[]> {
        return this.client.rest.get(TAGS, data);
    }

    create(data: { name: string; type: TagTypes }): Promise<void> {
        return this.client.rest.post(TAGS, data);
    }

    edit(data: { name: string; type: TagTypes }): Promise<void> {
        return this.client.rest.put(TAGS, data);
    }

    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${TAGS}/${id}`);
    }

    assign(tagId: number, items: AssignTagItemParam[]): Promise<void> {
        return this.client.rest.post(`${TAGS}/${tagId}/assign`, { items });
    }

    unassign(tagId: number, items: AssignTagItemParam[]): Promise<void> {
        return this.client.rest.post(`${TAGS}/${tagId}/unassign`, { items });
    }
}
