import { Client } from './client';
import { AuthToken, NbAppState } from '../types';
import { AccessToken } from '../types/access-token';
import { jwtDecode } from 'jwt-decode';
import { TokenUpdate } from './tokenUpdate';

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

        if (options.query) {
            path += '?' + makeUrlParams(options.query);
        }

        let request: RequestInit = {
            method,
            headers: this.state.requestParams.headers,
            cache: options.cache || this.state.requestParams.cache,
            body: options.body || this.state.requestParams.body,
        };

        if (this.state.authToken.access_token) {
            const token: AccessToken = jwtDecode(
                this.state.authToken.access_token,
            );
            const needUpdate =
                token &&
                token.is_remember &&
                this.tokenUpdate.isTokenExpire(token.exp);

            if (
                needUpdate &&
                !path.includes('/login') &&
                !path.includes('/assets')
            ) {
                const newTokens: AuthToken | null =
                    await this.tokenUpdate.refreshToken(this.state.authToken);

                if (newTokens) {
                    request.headers = {
                        ...request.headers,
                        Authorization: `Bearer ${newTokens.access_token}`,
                    };
                }
            }
        }

        if (!skipInterceptors) {
            for (const interceptor of this.client.requestInterceptors) {
                try {
                    request = await interceptor.fulfilled(request);
                } catch (error) {
                    if (interceptor.rejected) interceptor.rejected(error);
                    else throw error;
                }
            }
        }

        const url = `${this.state.clientParams.host}/api/v${this.state.clientParams.version || 1}${path}`;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        let response: Response;

        try {
            response = await fetch(sanitizedUrl, request);
        } catch (error) {
            for (const interceptor of this.client.responseInterceptors) {
                if (interceptor.rejected) {
                    try {
                        await interceptor.rejected(error);
                    } catch (error) {
                        throw error;
                    }
                } else throw error;
            }
            throw error;
        }

        for (const interceptor of this.client.responseInterceptors) {
            try {
                response = await interceptor.fulfilled(response);
            } catch (error) {
                if (interceptor.rejected) interceptor.rejected(error);
                else throw error;
            }
        }

        return response;
    }
}

const makeUrlParams = (params: Record<string, any>) => {
    const query = new URLSearchParams();

    Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
            params[key].forEach((value: any) => {
                query.append(key, value);
            });
        } else {
            query.append(key, params[key]);
        }
    });

    return query;
};
