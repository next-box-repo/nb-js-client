import { Client } from './client';
import {
    AuthToken,
    NbAppState,
    ResponseType,
    RequestMethod,
    HttpResponse,
    RequestConfig,
    RequestObserve,
    HttpEvent,
} from '../types';
import { AccessToken } from '../types/access-token';
import { jwtDecode } from 'jwt-decode';
import { TokenUpdate } from './token-update';
import { applyInterceptors, makeUrlParams, normalizeHeaders } from '../tools';

export const BASE_URL_V1 = '/api/v1';
export const BASE_URL_V2 = '/api/v2';
export const HOST = `${window.location.protocol}//${window.location.host}`;

export class Rest {
    constructor(
        private client: Client,
        private tokenUpdate: TokenUpdate,
    ) {}

    get state(): NbAppState {
        return this.client.state;
    }

    get(
        path: string,
        params?: Record<string, any>,
        config?: RequestConfig,
    ): Promise<any> {
        return this.request(RequestMethod.GET, path, {
            params,
            cache: 'no-cache',
            ...config,
        });
    }

    post(
        path: string,
        body?: BodyInit | null,
        config?: RequestConfig,
    ): Promise<any> {
        return this.request(RequestMethod.POST, path, { body, ...config });
    }

    put(
        path: string,
        body?: BodyInit | null,
        config?: RequestConfig,
    ): Promise<any> {
        return this.request(RequestMethod.PUT, path, {
            body,
            cache: 'no-cache',
            ...config,
        });
    }

    patch(
        path: string,
        body?: BodyInit | null,
        config?: RequestConfig,
    ): Promise<any> {
        return this.request(RequestMethod.PATCH, path, { body, ...config });
    }

    delete(
        path: string,
        params?: Record<string, any>,
        config?: RequestConfig,
    ): Promise<any> {
        return this.request(RequestMethod.DELETE, path, { params, ...config });
    }

    upload(
        path: string,
        body?: BodyInit | null,
        config?: RequestConfig,
    ): { promise: Promise<any>; abort: () => void } {
        const controller = new AbortController();
        const signal = controller.signal;

        const promise = this.request(RequestMethod.POST, path, {
            body,
            signal,
            ...config,
        });

        return { promise, abort: () => controller.abort() };
    }

    async request<T>(
        method: RequestMethod,
        path: string,
        config?: RequestConfig,
    ): Promise<T | HttpResponse<T> | HttpEvent<T>> {
        return new Promise(async (resolve, reject) => {
            const skipInterceptors = this.state.skipInterceptors ?? false;
            this.state.skipInterceptors = false;

            let request: RequestInit = {
                method,
                ...config,
            };

            if (config?.signal) request.signal = config.signal;

            if (!skipInterceptors) {
                config = await applyInterceptors(
                    this.client.requestInterceptors,
                    request,
                );
            }

            if (this.state.authToken) {
                for (const [id, item] of this.state.authToken.entries()) {
                    const token: AccessToken = jwtDecode(item.access_token);
                    const needUpdate =
                        token &&
                        token.is_remember &&
                        this.tokenUpdate.isTokenExpire(token.exp);
                    if (
                        needUpdate &&
                        !path.includes('/login') &&
                        !path.includes('/assets')
                    ) {
                        const tokens: AuthToken | null =
                            await this.tokenUpdate.refreshToken(item);
                        if (tokens) {
                            this.state.authToken.set(id, tokens);
                            config = await applyInterceptors(
                                this.client.requestInterceptors,
                                request,
                            );
                        }
                    }
                }
            }

            const xhr = new XMLHttpRequest();

            if (config?.params && Object.keys(config.params).length !== 0) {
                path += '?' + makeUrlParams(config.params);
            }

            const url = `${this.state.clientParams.host}${this.state.clientParams.version}${path}`;

            xhr.withCredentials = false;
            xhr.open(method, url, true);

            if (config?.headers) {
                const normalizedHeaders = normalizeHeaders(config.headers);

                for (const [key, value] of Object.entries(normalizedHeaders)) {
                    if (this.state.clientParams.host === HOST) {
                        xhr.setRequestHeader(key, value);
                    } else if (key.toLowerCase() !== 'content-type') {
                        xhr.setRequestHeader(key, value);
                    }
                }
            }

            if (config?.responseType) {
                xhr.responseType = config.responseType;
            }

            if (config?.signal) {
                config.signal.addEventListener('abort', () => {
                    xhr.abort();
                    reject(new Error('Upload aborted'));
                });
            }

            if (
                xhr.upload &&
                [
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.PATCH,
                ].includes(method)
            ) {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable && config?.onUploadProgress) {
                        config.onUploadProgress(event);
                    }
                };
            }

            xhr.onload = async () => {
                if (config?.signal && config.signal.aborted) return;

                const headers = new Headers();
                xhr.getAllResponseHeaders()
                    .split('\r\n')
                    .forEach((header) => {
                        const [key, value] = header.split(': ');
                        if (key && value) headers.append(key, value);
                    });

                let body: any;

                switch (config?.responseType) {
                    case ResponseType.Text:
                        body = xhr.responseText;
                        break;
                    case ResponseType.Blob:
                    case ResponseType.ArrayBuffer:
                        body = xhr.response;
                        break;
                    default:
                        try {
                            body = JSON.parse(xhr.responseText);
                        } catch {
                            body = xhr.responseText;
                        }
                }

                let response = {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers,
                    body: body as T,
                };

                response = await applyInterceptors(
                    this.client.responseInterceptors,
                    response,
                );

                if (xhr.status >= 200 && xhr.status < 300) {
                    if (config?.observe === RequestObserve.Response) {
                        resolve(response);
                    } else resolve(body as T);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        headers,
                        error: body,
                    });
                }
            };

            xhr.onerror = () => reject(new Error('Network error'));

            xhr.send(config?.body ?? null);
        });
    }

    async changeBaseUrlVersion<T>(
        baseUrl: string,
        handler: () => Promise<T>,
    ): Promise<T> {
        const originalBaseUrl = this.state.clientParams.version;
        this.state.clientParams.version = baseUrl;

        try {
            return await handler();
        } finally {
            this.state.clientParams.version = originalBaseUrl;
        }
    }

    async changeHost<T>(host: string, handler: () => Promise<T>): Promise<T> {
        this.state.clientParams.host = host;
        this.state.requestParams.headers = {};

        try {
            return await handler();
        } finally {
            this.state.clientParams.host = HOST;
        }
    }
}
