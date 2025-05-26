import { Client } from '../classes';
import { ResponseItem, ResponseList } from '../types';
import {
    CommentParams,
    Comment,
    CreateCommentParams,
    UpdateCommentParams,
    DeleteCommentParams,
    DeleteAllCommentParams,
} from '../types/comment';

const COMMENT = '/storage/element/version/comment';
const COMMENT_ALL = `${COMMENT}/all`;

export class StorageCommentApiService {
    constructor(private client: Client) {}

    list(params: CommentParams): Promise<ResponseList<Comment>> {
        return this.client.rest.get(`${COMMENT}`, params);
    }

    create(data: CreateCommentParams): Promise<ResponseItem<Comment>> {
        return this.client.rest.post(`${COMMENT}`, data);
    }

    update(data: UpdateCommentParams): Promise<ResponseItem<Comment>> {
        return this.client.rest.patch(`${COMMENT}`, data);
    }

    delete(params: DeleteCommentParams): Promise<void> {
        return this.client.rest.delete(`${COMMENT}`, params);
    }

    deleteAll(params: DeleteAllCommentParams): Promise<void> {
        return this.client.rest.delete(`${COMMENT_ALL}`, params);
    }
}
