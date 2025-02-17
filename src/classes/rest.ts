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

            if (config?.params && Object.keys(config.params).length === 0) {
                path += '?' + makeUrlParams(config.params);
            }

            const url = `${this.state.clientParams.host}${
                this.state.clientParams.version
            }${path}`;

            xhr.open(method, url, true);
            xhr.withCredentials = true;

            if (config?.headers) {
                const normalizedHeaders = normalizeHeaders(config.headers);

                for (const [key, value] of Object.entries(normalizedHeaders)) {
                    xhr.setRequestHeader(key, value);
                }
            }

            if (config?.responseType) {
                xhr.responseType = config.responseType;
            }

            if (xhr.upload) {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable && config?.onUploadProgress) {
                        config.onUploadProgress(event);
                    }
                };
            }

            xhr.onload = async () => {
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
                    case ResponseType.Blob:
                    case ResponseType.ArrayBuffer:
                        body = xhr.response;
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
}
