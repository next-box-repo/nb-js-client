import { Client } from './client';
import { sendRequest } from './helpers';
import { NbAppState } from './types';

export class Api {
    constructor(private client: Client) {}

    get state(): NbAppState {
        return this.client.state;
    }

    get(path: string, query?: Record<string, any>): Promise<any> {
        return sendRequest(
            'GET',
            this.state.client,
            {
                path,
                query: { ...this.state.api.query, ...query },
                headers: this.state.api.headers,
                cache: 'no-cache',
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
        );
    }

    post(path: string, body?: BodyInit | null): Promise<any> {
        return sendRequest(
            'POST',
            this.state.client,
            {
                path,
                body,
                headers: this.state.api.headers,
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
        );
    }

    put(path: string, body?: BodyInit | null): Promise<any> {
        return sendRequest(
            'PUT',
            this.state.client,
            {
                path,
                body,
                headers: this.state.api.headers,
                cache: 'no-cache',
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
        );
    }

    delete(path: string, query?: Record<string, any>): Promise<any> {
        return sendRequest(
            'PUT',
            this.state.client,
            {
                path,
                query: { ...this.state.api.query, ...query },
                headers: this.state.api.headers,
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
        );
    }
}
