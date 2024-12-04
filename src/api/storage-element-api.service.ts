import { Client } from '../classes';
import {
    RequestHistoryListParams,
    StorageElementHistoryNote,
    StorageElementPasteParams,
    ResponseItem,
    ResponseList,
    CreateStorageElementParams,
    StorageElementHistory,
    StorageElementPaste,
    StorageElementVersion,
    StorageRoot,
} from '../types';
import { RequestStorageListParams, StorageElement } from '../types';

const STORAGE = '/storage';
const STORAGE_ELEMENT = `${STORAGE}/element`;
const STORAGE_ELEMENT_MOVE = `${STORAGE_ELEMENT}/move`;
const STORAGE_ELEMENT_COPY = `${STORAGE_ELEMENT}/copy`;
const STORAGE_ELEMENT_HISTORY = `${STORAGE_ELEMENT}/history`;
const STORAGE_ELEMENT_VERSION = `${STORAGE_ELEMENT}/version`;
const STORAGE_ELEMENT_VERSION_CURRENT = `${STORAGE_ELEMENT_VERSION}/current`;

export class StorageElementApiService {
    constructor(private client: Client) {}

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

    size(data: { paths: string[]; divide_id?: number }): Promise<number> {
        if (!parseInt(data.divide_id?.toString() || '')) {
            delete data.divide_id;
        }

        return this.client.rest.post(
            `${STORAGE_ELEMENT}/size`,
            JSON.stringify(data),
        );
    }

    move(data: StorageElementPasteParams, hasFCA = false): Promise<void> {
        const { from_divide_id, to_divide_id } = data;
        const fcaParams = {
            ...data,
            from_divide_id: null,
            to_divide_id: null,
        };

        if (!hasFCA)
            return this.client.rest.post(
                STORAGE_ELEMENT_MOVE,
                JSON.stringify(data),
            );

        if (!from_divide_id) {
            return this.client.rest.put(
                `/disk/${to_divide_id}/files/from/box`,
                JSON.stringify(fcaParams),
            );
        }

        if (!to_divide_id) {
            return this.client.rest.put(
                `/disk/${from_divide_id}/files/to/box`,
                JSON.stringify(fcaParams),
            );
        }

        return this.client.rest.post(
            `/disk/${from_divide_id}/files/move/disk/${to_divide_id}`,
            JSON.stringify(fcaParams),
        );
    }

    copy(
        params: StorageElementPasteParams,
        from: StorageRoot,
        to: StorageRoot,
    ): Promise<void> {
        const { from_divide_id, to_divide_id } = params;

        let fcaParams: StorageElementPasteParams = {
            ...params,
            from_divide_id: null,
            to_divide_id: null,
        };

        // между подключениями
        if (to === StorageRoot.fca && from === StorageRoot.fca) {
            return this.client.rest.post(
                `/disk/${from_divide_id}/files/copy/disk/${to_divide_id}`,
                JSON.stringify(fcaParams),
            );
        }

        // в подключение
        if (to === StorageRoot.fca) {
            // из доступных мне
            if (from_divide_id) {
                fcaParams.from_divide_id = from_divide_id;
            }

            return this.client.rest.post(
                `/disk/${to_divide_id}/files/from/box`,
                JSON.stringify(fcaParams),
            );
        }

        // из подключения
        if (from === StorageRoot.fca) {
            // в доступные мне
            if (to_divide_id) {
                fcaParams.to_divide_id = to_divide_id;
            }

            return this.client.rest.post(
                `/disk/${from_divide_id}/files/to/box`,
                JSON.stringify(fcaParams),
            );
        }

        // в моем диске и в доступных мне
        return this.client.rest.post(
            STORAGE_ELEMENT_COPY,
            JSON.stringify(params),
        );
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

        return this.client.rest.post(
            `/storage/element/copy`,
            JSON.stringify(data),
        );
    }

    create(
        data: CreateStorageElementParams,
    ): Promise<ResponseItem<StorageElement>> {
        return this.client.rest.post(STORAGE_ELEMENT, JSON.stringify(data));
    }

    delete(path: string, divide_id?: number): Promise<void> {
        const params: any = { path };
        if (divide_id) params['divide_id'] = divide_id;

        return this.client.rest.delete(STORAGE_ELEMENT, params);
    }

    favorite(path: string): Promise<void> {
        return this.client.rest.put(
            `${STORAGE_ELEMENT}?path=${encodeURIComponent(path)}`,
            JSON.stringify({ is_favorite: true }),
        );
    }

    removeFavorite(path: string): Promise<void> {
        return this.client.rest.put(
            `${STORAGE_ELEMENT}?path=${encodeURIComponent(path)}`,
            JSON.stringify({ is_favorite: false }),
        );
    }

    createItem(
        data: CreateStorageElementParams,
    ): Promise<ResponseItem<StorageElement>> {
        return this.client.rest.post(STORAGE_ELEMENT, JSON.stringify(data));
    }

    createWorkDir(
        data: CreateStorageElementParams,
    ): Promise<ResponseItem<StorageElement>> {
        return this.client.rest.post(STORAGE_ELEMENT, JSON.stringify(data));
    }

    history(
        params: RequestHistoryListParams,
    ): Promise<ResponseList<StorageElementHistory>> {
        return this.client.rest.get(STORAGE_ELEMENT_HISTORY, params);
    }

    versions(
        params: RequestHistoryListParams,
    ): Promise<ResponseList<StorageElementVersion>> {
        return this.client.rest.get(STORAGE_ELEMENT_VERSION, params);
    }

    createVersion(
        data: StorageElementHistoryNote,
    ): Promise<ResponseItem<StorageElementVersion>> {
        return this.client.rest.post(
            STORAGE_ELEMENT_VERSION,
            JSON.stringify(data),
        );
    }

    editVersion(
        data: StorageElementHistoryNote,
    ): Promise<ResponseItem<StorageElementVersion>> {
        return this.client.rest.put(
            STORAGE_ELEMENT_VERSION,
            JSON.stringify(data),
        );
    }

    deleteVersion(params: RequestHistoryListParams): Promise<void> {
        return this.client.rest.delete(STORAGE_ELEMENT_VERSION, params);
    }

    makeCurrentVersion(data: RequestHistoryListParams): Promise<void> {
        return this.client.rest.post(
            STORAGE_ELEMENT_VERSION_CURRENT,
            JSON.stringify(data),
        );
    }
}
