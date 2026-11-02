import { RequestBaseParams } from './base';

export interface CommentParams extends RequestBaseParams {
    divide_id?: number;
    file_version_id: string;
    path: string;
}

export interface CreateCommentParams {
    comment: string;
    divide_id?: number;
    file_version_id: string;
    path: string;
}

export interface UpdateCommentParams {
    comment: string;
    path: string;
    version_comment_id: number;
    divide_id?: number;
    is_decided?: boolean;
}

export interface DeleteCommentParams {
    path: string;
    version_comment_id: number;
    divide_id?: number;
}

export interface DeleteAllCommentParams {
    path: string;
    file_version_id: string;
    divide_id?: number;
}

export interface Comment {
    id: number;
    author_id: number;
    author_service?: string;
    comment: string;
    file_version_id: string;
    is_decided: boolean;
    create_date: string;
    update_date: string;
}

export interface SpaceCommentParams extends RequestBaseParams {
    file_id: string;
    file_version_id: string;
}

export interface CreateSpaceCommentParams {
    comment: string;
    file_id: string;
    file_version_id: string;
}

export interface UpdateSpaceCommentParams {
    comment?: string;
    file_id: string;
    file_version_id: string;
    version_comment_id: number;
    is_decided?: boolean;
}

export interface DeleteSpaceCommentParams {
    file_id: string;
    file_version_id: string;
    version_comment_id: number;
}

export interface DeleteAllSpaceCommentParams {
    file_id: string;
    file_version_id: string;
}
