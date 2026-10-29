import type { Client } from '../classes/client';
import { AssignTagItemParam, Tag, ColorTypes } from '../types';

const TAG = '/tag';
const TAG_LIST = `${TAG}/list`;
const SPACES = '/spaces';
const FILES_TAG = `/files/tag`;

export class TagsApiService {
    constructor(private client: Client) {}

    list(params?: RequestTagParams): Promise<Tag[]> {
        return this.client.rest.get(TAG_LIST, params);
    }

    get(id: number): Promise<Tag> {
        return this.client.rest.get(`${TAG}/${id}`);
    }

    assign(id: number, items: AssignTagItemParam[]): Promise<void> {
        return this.client.rest.post(`${TAG}/${id}/assign`, { items });
    }

    unassign(id: number, items: AssignTagItemParam[]): Promise<void> {
        return this.client.rest.post(`${TAG}/${id}/unassign`, { items });
    }

    create(params: TagCreateParams): Promise<Tag> {
        return this.client.rest.post(TAG, params);
    }

    update(id: number, params: TagCreateParams): Promise<Tag> {
        return this.client.rest.put(`${TAG}/${id}`, params);
    }

    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${TAG}/${id}`);
    }

    assignToSpaceFile(
        id: number,
        tag_id: number,
        file_container_ids: string[],
    ): Promise<void> {
        return this.client.rest.post(
            `${SPACES}/${id}${FILES_TAG}/${tag_id}/assign`,
            { file_container_ids },
        );
    }

    unassignFromSpaceFile(
        id: number,
        tag_id: number,
        file_container_ids: string[],
    ): Promise<void> {
        return this.client.rest.post(
            `${SPACES}/${id}${FILES_TAG}/${tag_id}/unassign`,
            { file_container_ids },
        );
    }
}

export interface RequestTagParams {
    search?: string;
}

export interface TagCreateParams {
    name: string;
    type: ColorTypes;
}
