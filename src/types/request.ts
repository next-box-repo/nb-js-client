export enum ResponseType {
    ArrayBuffer = 'arraybuffer',
    Blob = 'blob',
    Json = 'json',
    Text = 'text',
}

export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
}

export enum RequestObserve {
    Body = 'body',
    Response = 'response',
}

export interface HttpResponse<T> {
    status: number;
    statusText: string;
    headers: Headers;
    body: T;
}

export interface HttpEvent<T> {
    loaded?: number;
    total?: number;
    body?: HttpResponse<T>;
    error?: any;
}

export interface RequestConfig {
    host?: string;
    version?: string;
    params?: Record<string, string>;
    body?: any;
    cache?: RequestCache;
    headers?: HeadersInit;
    observe?: RequestObserve;
    responseType?: ResponseType;
    signal?: AbortSignal | null;
    onUploadProgress?: OnUploadProgress;
}

export interface ProgressEvent {
    loaded: number;
    total: number;
}

export type OnUploadProgress = (progressEvent: ProgressEvent) => void;
