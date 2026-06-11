import { Client } from '../classes';
import {
    HttpEvent,
    OnUploadProgress,
    ResponseList,
    ResponseType,
    SpaceElement,
    StorageElementContentType,
    StorageElementType,
} from '../types';
import { RequestStorageListParams } from './storage-element-api.service';

const SPACES = '/spaces';
const FILES = '/files';
const FILES_UPLOAD = '/files/upload';

export class SpaceFilesApiService {
    constructor(private client: Client) {}

    list(
        id: number,
        params: RequestSpaceElementListParams,
    ): Promise<ResponseList<SpaceElement>> {
        return this.client.rest.get(`${SPACES}/${id}/${FILES}/list`, params);
    }

    get(id: number, params: { file_id: string }): Promise<SpaceElement> {
        return this.client.rest.get(`${SPACES}/${id}/${FILES}`, params);
    }

    create(
        id: number,
        params: RequestSpaceCreateElementParams,
    ): Promise<SpaceElement> {
        return this.client.rest.post(`${SPACES}/${id}/${FILES}`, params);
    }

    replace(
        id: number,
        params: { file_id: string },
        data: any,
    ): Promise<SpaceElement> {
        const queryParams: Record<string, string> = Object.fromEntries(
            Object.entries(params)
                .filter(([, value]) => value !== undefined && value !== null)
                .map(([key, value]) => [key, String(value)]),
        );

        return this.client.rest.put(`${SPACES}/${id}/${FILES}`, data, {
            params: queryParams,
        });
    }

    delete(id: number, params: RequestSpaceDeleteFilesParams): Promise<void> {
        return this.client.rest.delete(`${SPACES}/${id}/${FILES}`, params);
    }

    copy(
        id: number,
        params: RequestSpaceCopyFileParams,
    ): Promise<SpaceElement> {
        return this.client.rest.post(`${SPACES}/${id}/${FILES}/copy`, params);
    }

    download(
        id: number,
        params: RequestSpaceDownloadFileParams,
    ): Promise<Blob> {
        return this.client.rest.get(
            `${SPACES}/${id}/${FILES}/download`,
            params,
            {
                responseType: ResponseType.Blob,
            },
        );
    }

    move(id: number, params: RequestSpaceMoveFilesParams): Promise<void> {
        return this.client.rest.post(`${SPACES}/${id}/${FILES}/move`, params);
    }

    rename(
        id: number,
        params: RequestSpaceRenameFileParams,
    ): Promise<SpaceElement> {
        return this.client.rest.post(`${SPACES}/${id}/${FILES}/rename`, params);
    }

    upload(
        onProgress: OnUploadProgress,
        id: number,
        file: File,
        params: RequestSpaceUploadParams,
    ): {
        promise: Promise<HttpEvent<SpaceElement>>;
        abort: () => void;
    } {
        const form = new FormData();

        form.set('overwrite', String(params.overwrite ?? false));
        form.set('file', file);

        if (params.parent_id) form.set('parent_id', params.parent_id);

        const { promise, abort } = this.client.rest.upload(
            `${SPACES}/${id}/${FILES_UPLOAD}`,
            form,
            {
                onUploadProgress: (event) => {
                    onProgress(event);
                },
            },
        );

        return { promise, abort };
    }

    uploadNet(
        id: number,
        params: RequestSpaceUploadFromUrlParams,
    ): Promise<SpaceElement> {
        return this.client.rest.post(
            `${SPACES}/${id}/${FILES_UPLOAD}/net`,
            params,
        );
    }
}

export type RequestSpaceElementListParams = Pick<
    RequestStorageListParams,
    | 'is_search_dir'
    | 'limit'
    | 'max_size'
    | 'min_size'
    | 'offset'
    | 'order_by'
    | 'order_direction'
    | 'search'
    | 'type'
> & {
    content_types?: StorageElementContentType[];
    parent_id?: string;
};

export interface RequestSpaceGetFileParams {
    file_id: string;
}

export interface RequestSpaceReplaceFileParams {
    file_id: string;
}

export interface RequestSpaceCreateElementParams {
    name: string;
    type: StorageElementType;
    parent_id?: string;
    overwrite?: boolean;
    created_by_extension?: string;
}

export interface RequestSpaceDeleteFilesParams {
    file_ids: string[];
    hard?: boolean;
}

export interface RequestSpaceCopyFileParams {
    file_id: string;
    to_parent_id?: string | null;
    to_space_id?: number | null;
    overwrite?: boolean;
    resolve_conflict_duplicate?: boolean;
}

export interface RequestSpaceDownloadFileParams {
    file_id: string;
    download?: boolean;
    last_used_extension?: string;
    with_preview?: boolean;
}

export interface RequestSpaceMoveItem {
    file_id: string;
    to_parent_id?: string;
}

export interface RequestSpaceMoveFilesParams {
    move_items: RequestSpaceMoveItem[];
}

export interface RequestSpaceRenameFileParams {
    file_id: string;
    name: string;
}

export interface RequestSpaceUploadParams {
    parent_id?: string;
    overwrite: boolean;
}

export interface RequestSpaceUploadFromUrlParams {
    name: string;
    url: string;
    parent_id?: string;
    overwrite?: boolean;
}
