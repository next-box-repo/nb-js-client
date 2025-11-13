import { Client } from './client';
import {
    NbAppState,
    ResponseType,
    RequestMethod,
    HttpResponse,
    RequestConfig,
    RequestObserve,
    HttpEvent,
    AuthTokenUpdate,
} from '../types';
import { AccessToken } from '../types/access-token';
import { jwtDecode } from 'jwt-decode';
import { NEED_TOKEN_UPDATE_ERROR, TokenUpdate } from './token-update';
import {
    applyInterceptors,
    makeUrlParams,
    normalizeHeaders,
    prepareRequestBody,
} from '../tools';

export const BASE_URL_V1 = '/api/v1';
export const BASE_URL_V2 = '/api/v2';

export class Rest {
    constructor(
        private client: Client,
        private tokenUpdate: TokenUpdate,
    ) {}

    baseHost = '';

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

    post(path: string, body?: any, config?: RequestConfig): Promise<any> {
        return this.request(RequestMethod.POST, path, { body, ...config });
    }

    put(path: string, body?: any, config?: RequestConfig): Promise<any> {
        return this.request(RequestMethod.PUT, path, {
            body,
            cache: 'no-cache',
            ...config,
        });
    }

    patch(path: string, body?: any, config?: RequestConfig): Promise<any> {
        return this.request(RequestMethod.PATCH, path, { body, ...config });
    }

    delete(
        path: string,
        params?: Record<string, any>,
        config?: RequestConfig,
    ): Promise<any> {
        return this.request(RequestMethod.DELETE, path, { params, ...config });
    }

    head(
        path: string,
        params?: Record<string, any>,
        config?: RequestConfig,
    ): Promise<any> {
        return this.request(RequestMethod.HEAD, path, {
            params,
            ...config,
        });
    }

    upload(
        path: string,
        body: FormData,
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

    request<T>(
        method: RequestMethod,
        path: string,
        config?: RequestConfig,
    ): Promise<T | HttpResponse<T> | HttpEvent<T>> {
        return new Promise((resolve, reject) => {
            const skipInterceptors = this.state.skipInterceptors ?? false;
            this.state.skipInterceptors = false;

            let requestInit: RequestInit & RequestConfig = {
                method,
                ...config,
            };
            if (config?.signal) requestInit.signal = config.signal;

            const sendRequest = async () => {
                // request interceptors
                if (!skipInterceptors) {
                    requestInit =
                        (await applyInterceptors(
                            this.client.requestInterceptors,
                            requestInit,
                        )) ?? requestInit;
                }

                // refresh token
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
                            const tokens: AuthTokenUpdate | null =
                                await this.tokenUpdate.refreshToken(
                                    item,
                                    this.baseHost!,
                                );

                            if (tokens) {
                                this.state.authToken.set(id, tokens);

                                requestInit =
                                    (await applyInterceptors(
                                        this.client.requestInterceptors,
                                        requestInit,
                                    )) ?? requestInit;
                            }
                        }
                    }
                }

                const xhr = new XMLHttpRequest();

                // params
                if (
                    requestInit.params &&
                    Object.keys(requestInit.params).length
                ) {
                    path += '?' + makeUrlParams(requestInit.params);
                }

                const host = requestInit.host ?? this.state.clientParams.host;
                const version =
                    requestInit.version ?? this.state.clientParams.version;

                const url = `${host}${version}${path}`;

                xhr.open(method, url, true);

                // headers
                if (requestInit.headers) {
                    const normalized = normalizeHeaders(requestInit.headers);
                    for (const [k, v] of Object.entries(normalized)) {
                        if (host === this.baseHost) {
                            xhr.setRequestHeader(k, v);
                        } else if (k.toLowerCase() !== 'content-type') {
                            xhr.setRequestHeader(k, v);
                        }
                    }
                }

                // responseType
                if (requestInit.responseType) {
                    xhr.responseType = requestInit.responseType;
                }

                // abort
                if (requestInit.signal) {
                    requestInit.signal.addEventListener('abort', () => {
                        xhr.abort();
                        reject(new Error('Request aborted'));
                    });
                }

                // upload progress
                if (
                    xhr.upload &&
                    (method === RequestMethod.POST ||
                        method === RequestMethod.PUT ||
                        method === RequestMethod.PATCH)
                ) {
                    xhr.upload.onprogress = (ev) => {
                        if (
                            ev.lengthComputable &&
                            requestInit.onUploadProgress
                        ) {
                            requestInit.onUploadProgress(ev);
                        }
                    };
                }

                // onload
                xhr.onload = async () => {
                    if (requestInit.signal && requestInit.signal.aborted)
                        return;

                    // body
                    let body: any;
                    switch (requestInit.responseType) {
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

                    // headers
                    const headers = new Headers();
                    xhr.getAllResponseHeaders()
                        .split('\r\n')
                        .forEach((line) => {
                            const [k, v] = line.split(': ');
                            if (k && v) headers.append(k, v);
                        });

                    const base = {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        headers,
                        url: xhr.responseURL,
                    };

                    // success
                    if (xhr.status >= 200 && xhr.status < 300) {
                        await applyInterceptors(
                            this.client.responseInterceptors,
                            base,
                        );

                        if (requestInit.observe === RequestObserve.Response) {
                            resolve({ ...base, body } as HttpResponse<T>);
                        } else {
                            resolve(body as T);
                        }
                        return;
                    }

                    // error
                    if (
                        this.state.authToken &&
                        (body as any)?.code === NEED_TOKEN_UPDATE_ERROR
                    ) {
                        const tokens = await this.tokenUpdate.refreshToken(
                            this.state.authToken.get(0)!,
                            this.baseHost!,
                        );
                        if (tokens) this.state.authToken.set(0, tokens);
                    }

                    const errorPayload = { ...base, error: body };

                    await applyInterceptors(
                        this.client.responseInterceptors,
                        errorPayload,
                    );

                    reject(errorPayload);
                };

                // onerror
                xhr.onerror = () => {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        url: xhr.responseURL,
                        error: 'Network error',
                    });
                };

                // send
                xhr.send(prepareRequestBody(requestInit.body));
            };

            sendRequest().catch(reject);
        });
    }
}
