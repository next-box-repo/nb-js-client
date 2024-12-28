import { Client } from './client';
import { AuthToken, NbAppState } from '../types';
import { AccessToken } from '../types/access-token';
import { jwtDecode } from 'jwt-decode';
import { TokenUpdate } from './token-update';
import { HttpErrorResponse } from './http-error-response';
import { applyInterceptors, makeUrlParams } from '../tools';

export class Rest {
    constructor(
        private client: Client,
        private tokenUpdate: TokenUpdate,
    ) {}

    get state(): NbAppState {
        return this.client.state;
    }

    get(path: string, query?: Record<string, any>): Promise<any> {
        return this.sendRequest('GET', path, { query, cache: 'no-cache' });
    }

    post(path: string, body?: BodyInit | null): Promise<any> {
        return this.sendRequest('POST', path, { body });
    }

    put(path: string, body?: BodyInit | null): Promise<any> {
        return this.sendRequest('PUT', path, { body, cache: 'no-cache' });
    }

    patch(path: string, body?: BodyInit | null): Promise<any> {
        return this.sendRequest('PATCH', path, { body });
    }

    delete(path: string, query?: Record<string, any>): Promise<any> {
        return this.sendRequest('DELETE', path, { query });
    }

    private async sendRequest(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        path: string,
        options: {
            query?: Record<string, any>;
            body?: BodyInit | null;
            cache?: RequestCache;
        } = {},
    ): Promise<Response> {
        const skipInterceptors = this.state.skipInterceptors ?? false;
        this.state.skipInterceptors = false;

        let request: RequestInit = {
            method,
            headers: this.state.requestParams.headers,
            cache: options.cache || this.state.requestParams.cache,
            body: options.body || this.state.requestParams.body,
        };

        if (!skipInterceptors) {
            request = await applyInterceptors(
                this.client.requestInterceptors,
                request,
            );
        }

        if (this.state.authToken) {
            for (const [index, item] of this.state.authToken.entries()) {
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
                        this.state.authToken[index] = tokens;

                        request = await applyInterceptors(
                            this.client.requestInterceptors,
                            request,
                        );
                    }
                }
            }
        }

        if (options.query) {
            path += '?' + makeUrlParams(options.query);
        }

        const executeFetch = async (
            url: string,
            request: RequestInit,
        ): Promise<Response> => {
            try {
                const response = await fetch(url, request);

                let responseBody: any;
                try {
                    responseBody = await response.clone().json();
                } catch {
                    responseBody = await response.text();
                }

                if (!response.ok) {
                    throw new HttpErrorResponse({
                        error: responseBody,
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url,
                    });
                }

                return response;
            } catch (error) {
                await applyInterceptors(
                    this.client.responseInterceptors,
                    error as Response,
                );

                throw error;
            }
        };

        const url = `${this.state.clientParams.host}/api/v${
            this.state.clientParams.version || 1
        }${path}`;
        const sanitizedUrl = url.replace(/([^:]\/)+\/+/g, '$1');

        let response: Response = await executeFetch(sanitizedUrl, request);
        response = await applyInterceptors(
            this.client.responseInterceptors,
            response,
        );

        return response;
    }
}
