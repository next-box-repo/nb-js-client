import { Client } from '../classes';
import {
    ResponseItem,
    ResponseList,
    StorageElementPaste,
    StorageRoot,
    RequestBaseParams,
    StorageElementType,
    StorageRouteData,
    SizeBySection,
    User,
    DivideResourceParams,
    ResourceAccess,
} from '../types';
import { StorageElement } from '../types';
import { FcaApiService } from './fca-api.service';

const STORAGE = '/storage';
const STORAGE_ELEMENT = `${STORAGE}/element`;
const STORAGE_DIVIDE_RESOURCE = `${STORAGE_ELEMENT}/divide/resource`;
const STORAGE_ELEMENT_MOVE = `${STORAGE_ELEMENT}/move`;
const STORAGE_ELEMENT_COPY = `${STORAGE_ELEMENT}/copy`;
const STORAGE_ELEMENT_SECTION_SIZE = `${STORAGE_ELEMENT}/content_type_size`;

const DISK = '/disk';

export class StorageElementApiService {
    constructor(
        private client: Client,
        private fcaApiService: FcaApiService,
    ) {}

    list(
        params?: RequestStorageListParams,
    ): Promise<ResponseList<StorageElement>> {
        return this.client.rest.get(STORAGE, params);
    }

    info(params: {
        path: string;
        divide_id?: number;
        file_version_id?: string;
    }): Promise<StorageElement> {
        if (!parseInt(params.divide_id?.toString() || '')) {
            delete params.divide_id;
        }

        if (!params.file_version_id) delete params.file_version_id;

        return this.client.rest.get(STORAGE_ELEMENT, params);
    }

    combineInfo({
        root,
        rootId,
        path,
        file_version_id,
    }: StorageRouteData): Promise<StorageElement> {
        if (root === StorageRoot.fca && rootId) {
            return this.fcaApiService.info(rootId, path);
        }

        return this.info({ path, divide_id: rootId, file_version_id });
    }

    size(data: StorageItemSizeParams): Promise<number> {
        return this.client.rest.post(`${STORAGE_ELEMENT}/size`, data);
    }

    move(
        params: StorageElementPasteParams,
        to: StorageRoot,
        from: StorageRoot,
    ): Promise<void> {
        const { from_divide_id, to_divide_id } = params;

        let fcaParams: StorageElementPasteParams = {
            ...params,
            from_divide_id: null,
            to_divide_id: null,
        };

        if (to === StorageRoot.fca && from === StorageRoot.fca) {
            return this.client.rest.post(
                `${DISK}/${from_divide_id}/files/move${DISK}/${to_divide_id}`,
                fcaParams,
            );
        }

        if (to === StorageRoot.fca) {
            if (from_divide_id) {
                fcaParams.from_divide_id = from_divide_id;
            }

            return this.client.rest.put(
                `${DISK}/${to_divide_id}/files/from/box`,
                fcaParams,
            );
        }

        if (from === StorageRoot.fca) {
            if (to_divide_id) {
                fcaParams.to_divide_id = to_divide_id;
            }

            return this.client.rest.put(
                `${DISK}/${from_divide_id}/files/to/box`,
                fcaParams,
            );
        }

        return this.client.rest.post(STORAGE_ELEMENT_MOVE, params);
    }

    copy(
        params: StorageElementPasteParams,
        from: StorageRoot,
        to: StorageRoot,
    ): Promise<CopyResponse> {
        const { from_divide_id, to_divide_id } = params;

        let fcaParams: StorageElementPasteParams = {
            ...params,
            from_divide_id: null,
            to_divide_id: null,
        };

        // между подключениями
        if (to === StorageRoot.fca && from === StorageRoot.fca) {
            return this.client.rest.post(
                `${DISK}/${from_divide_id}/files/copy${DISK}/${to_divide_id}`,
                fcaParams,
            );
        }

        // в подключение
        if (to === StorageRoot.fca) {
            // из доступных мне
            if (from_divide_id) {
                fcaParams.from_divide_id = from_divide_id;
            }

            return this.client.rest.post(
                `${DISK}/${to_divide_id}/files/from/box`,
                fcaParams,
            );
        }

        // из подключения
        if (from === StorageRoot.fca) {
            // в доступные мне
            if (to_divide_id) {
                fcaParams.to_divide_id = to_divide_id;
            }

            return this.client.rest.post(
                `${DISK}/${from_divide_id}/files/to/box`,
                fcaParams,
            );
        }

        // в моем диске и в доступных мне
        return this.client.rest.post(STORAGE_ELEMENT_COPY, params);
    }

    pasteFromShared(
        from_sharing_token: string,
        paths: StorageElementPaste[],
        from_sharing_password?: string,
    ): Promise<void> {
        const data = {
            from_sharing_token,
            from_sharing_password,
            paths,
        };

        return this.client.rest.post(`${STORAGE_ELEMENT}/copy`, data);
    }

    create(
        data: CreateStorageElementParams,
    ): Promise<ResponseItem<StorageElement>> {
        return this.client.rest.post(STORAGE_ELEMENT, data);
    }

    delete(path: string, divide_id?: number): Promise<void> {
        const params: any = { path };
        if (divide_id) params['divide_id'] = divide_id;

        return this.client.rest.delete(STORAGE_ELEMENT, params);
    }

    favorite(path: string): Promise<void> {
        return this.client.rest.put(
            `${STORAGE_ELEMENT}?path=${encodeURIComponent(path)}`,
            { is_favorite: true },
        );
    }

    removeFavorite(path: string): Promise<void> {
        return this.client.rest.put(
            `${STORAGE_ELEMENT}?path=${encodeURIComponent(path)}`,
            { is_favorite: false },
        );
    }

    createItem(
        data: CreateStorageElementParams,
    ): Promise<ResponseItem<StorageElement>> {
        return this.client.rest.post(STORAGE_ELEMENT, data);
    }

    createWorkDir(
        data: CreateStorageElementParams,
    ): Promise<ResponseItem<StorageElement>> {
        return this.client.rest.post(STORAGE_ELEMENT, data);
    }

    sizeWithSection(params?: {
        owner_id: number;
        with_trash: boolean;
    }): Promise<SizeBySection[] | null> {
        return this.client.rest.get(STORAGE_ELEMENT_SECTION_SIZE, params);
    }

    getDivideResources(
        params: DivideResourceParams,
    ): Promise<ResponseList<ResourceAccess>> {
        return this.client.rest.get(STORAGE_DIVIDE_RESOURCE, params);
    }
}

export interface RequestStorageListParams extends RequestBaseParams {
    search?: string;
    is_favorite?: boolean;
    is_divided?: boolean;
    divide_id?: number | null;
    is_trash?: boolean;
    path?: string;
    min_size?: number | null;
    max_size?: number | null;
    type?: StorageElementType;
    file_name_ext?: string[];
    from_sharing_token?: string;
    from_path?: string;
    from_sharing_password?: string;
    without_content_work_dir?: boolean;
    is_search_dir?: null | boolean;
}

export interface StorageElementPasteParams {
    paths: StorageElementPaste[];
    overwrite: boolean;
    from_divide_id?: number | null;
    to_divide_id?: number | null;
}

export type CreateStorageElementParams = Pick<
    StorageElement,
    'created_by_extension' | 'divide_id' | 'name' | 'type' | 'path'
> & {
    is_work_dir?: boolean;
};

export interface CopyResponse {
    not_copied?: StorageElement[];
    rows: StorageElement[];
}

//NOTE: is_divided и is_favorite нужно выставлять только если по всему корню размер
export interface StorageItemSizeParams {
    paths: StorageItemSizePathParams[];
    is_divided?: boolean;
    is_favorite?: boolean;
}

export interface StorageItemSizePathParams {
    path: string;
    divide_id?: number;
}
