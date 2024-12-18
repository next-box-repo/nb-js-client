import { Client } from './client';
import { sendRequest } from '../helpers';
import { NbAppState } from '../types';

export class Rest {
    constructor(private client: Client) {}

    get state(): NbAppState {
        return this.client.state;
    }

    get(path: string, query?: Record<string, any>): Promise<any> {
        return this.request('GET', path, { query });
    }

    post(path: string, body?: BodyInit | null): Promise<any> {
        return this.request('POST', path, { body });
    }

    put(path: string, body?: BodyInit | null): Promise<any> {
        return this.request('PUT', path, { body });
    }

    patch(path: string, body?: BodyInit | null): Promise<any> {
        return this.request('PATCH', path, { body });
    }

    delete(path: string, query?: Record<string, any>): Promise<any> {
        return this.request('DELETE', path, { query });
    }

    private request(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        path: string,
        options: {
            query?: Record<string, any>;
            body?: BodyInit | null;
            cache?: RequestCache;
        } = {},
    ): Promise<any> {
        const { query, body, cache } = options;

        return sendRequest(
            method,
            this.state.clientParams,
            {
                path,
                query: { ...this.state.requestParams.query, ...query },
                body,
                headers: this.state.requestParams.headers,
                cache: cache,
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
            this.state.skipInterceptors,
        ).finally(() => {
            if (this.state.skipInterceptors)
                this.state.skipInterceptors = false;
        });
    }
}
