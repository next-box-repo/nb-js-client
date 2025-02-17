import { RequestAuthTokenParams } from '../api';
import { PermissionType } from './divide';

export interface NbClientParams {
    host?: string;
    version?: string;
}

export interface NbRequestParams {
    path: string;
    headers?: Record<string, any>;
    query?: Record<string, any>;
    body?: any;
    cache?: RequestCache;
}

export interface NbAppState {
    clientParams: NbClientParams;
    requestParams: NbRequestParams;
    authToken: Map<number, RequestAuthTokenParams> | null;
    skipInterceptors: boolean;
}

export interface ResponseItem<T> {
    row: T;
}

export interface ResponseList<T> {
    rows: T[];
    total: number;
    current?: { access_mode: PermissionType };
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
