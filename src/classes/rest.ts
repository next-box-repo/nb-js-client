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

            let requestInit = { method, ...config };
            if (config?.signal) requestInit.signal = config.signal;

            const sendRequest = async () => {
                // request interceptors
                if (!skipInterceptors) {
                    config = await applyInterceptors(
                        this.client.requestInterceptors,
                        requestInit,
                    );
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

                                config = await applyInterceptors(
                                    this.client.requestInterceptors,
                                    requestInit,
                                );
                            }
                        }
                    }
                }

                const xhr = new XMLHttpRequest();

                // params
                if (config?.params && Object.keys(config.params).length) {
                    path += '?' + makeUrlParams(config.params);
                }

                const host = config?.host ?? this.state.clientParams.host;
                const version =
                    config?.version ?? this.state.clientParams.version;

                const url = `${host}${version}${path}`;

                xhr.open(method, url, true);

                // headers
                if (config?.headers) {
                    const normalized = normalizeHeaders(config.headers);
                    for (const [k, v] of Object.entries(normalized)) {
                        if (host === this.baseHost) xhr.setRequestHeader(k, v);
                        else if (k.toLowerCase() !== 'content-type')
                            xhr.setRequestHeader(k, v);
                    }
                }

                // responseType
                if (config?.responseType)
                    xhr.responseType = config.responseType;

                // abort
                if (config?.signal) {
                    config.signal.addEventListener('abort', () => {
                        xhr.abort();
                        reject(new Error('Upload aborted'));
                    });
                }

                // upload progress
                if (
                    xhr.upload &&
                    [
                        RequestMethod.POST,
                        RequestMethod.PUT,
                        RequestMethod.PATCH,
                    ].includes(method)
                ) {
                    xhr.upload.onprogress = (ev) => {
                        if (ev.lengthComputable && config?.onUploadProgress)
                            config.onUploadProgress(ev);
                    };
                }

                // onload
                xhr.onload = async () => {
                    if (config?.signal && config.signal.aborted) return;

                    // body
                    let body;
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
                        // response success interceptors
                        await applyInterceptors(
                            this.client.responseInterceptors,
                            base,
                        );

                        if (config?.observe === RequestObserve.Response)
                            resolve({ ...base, body });
                        else resolve(body);
                        return;
                    }

                    // error
                    if (
                        this.state.authToken &&
                        body?.code === NEED_TOKEN_UPDATE_ERROR
                    ) {
                        const tokens = await this.tokenUpdate.refreshToken(
                            this.state.authToken.get(0)!,
                            this.baseHost,
                        );
                        if (tokens) this.state.authToken.set(0, tokens);
                    }

                    let errorPayload = { ...base, error: body };

                    // response error interceptors
                    errorPayload = await applyInterceptors(
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
                xhr.send(prepareRequestBody(config?.body));
            };

            sendRequest().catch(reject);
        });
    }
}
