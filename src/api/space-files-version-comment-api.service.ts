import { Client } from '../classes';
import {
    Comment,
    CreateSpaceCommentParams,
    DeleteAllSpaceCommentParams,
    DeleteSpaceCommentParams,
    ResponseList,
    SpaceCommentParams,
    UpdateSpaceCommentParams,
} from '../types';

const SPACES = '/spaces';
const FILES_VERSION_COMMENT = '/files/version/comment';
const FILES_VERSION_COMMENT_ALL = `${FILES_VERSION_COMMENT}/all`;

export class SpaceFilesVersionCommentApiService {
    constructor(private client: Client) {}

    list(
        id: number,
        params: SpaceCommentParams,
    ): Promise<ResponseList<Comment>> {
        return this.client.rest.get(
            `${SPACES}/${id}${FILES_VERSION_COMMENT}`,
            params,
        );
    }

    create(id: number, data: CreateSpaceCommentParams): Promise<Comment> {
        return this.client.rest.post(
            `${SPACES}/${id}${FILES_VERSION_COMMENT}`,
            data,
        );
    }

    update(id: number, data: UpdateSpaceCommentParams): Promise<Comment> {
        return this.client.rest.put(
            `${SPACES}/${id}${FILES_VERSION_COMMENT}`,
            data,
        );
    }

    delete(id: number, params: DeleteSpaceCommentParams): Promise<void> {
        return this.client.rest.delete(
            `${SPACES}/${id}${FILES_VERSION_COMMENT}`,
            params,
        );
    }

    deleteAll(id: number, params: DeleteAllSpaceCommentParams): Promise<void> {
        return this.client.rest.delete(
            `${SPACES}/${id}${FILES_VERSION_COMMENT_ALL}`,
            params,
        );
    }
}
