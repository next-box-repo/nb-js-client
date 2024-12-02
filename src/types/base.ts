export interface NbClientParams {
    host: string;
    version?: number;
}

export interface NbRequestParams {
    path: string;
    headers?: Record<string, any>;
    query?: Record<string, any>;
    body?: any;
    cache?: 'no-cache';
}

export interface NbAppState {
    client: NbClientParams;
    api: NbRequestParams;
}

export interface ResponseItem<T> {
    row: T;
}

export interface ResponseList<T> {
    rows: T[];
    total: number;
}

export interface RequestBaseParams {
    limit: number;
    offset?: number;
    order_by?: string;
    order_direction?: OrderDirection;
}

export enum OrderDirection {
    DEFAULT = '',
    ASC = 'asc',
    DESC = 'desc',
}

export type Lang = { [key: string]: string };

export enum EngineType {
    WebSocket = 'websocket',
    PostMessage = 'postmessage',
    Empty = '',
}

export enum StorageRoot {
    my = 'my',
    fca = 'fca',
    divide = 'divide',
    share = 'share',
    favorite = 'favorite',
}
