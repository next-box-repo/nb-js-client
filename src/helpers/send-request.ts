import { NbClientParams, NbRequestParams } from '../types/base';

export function sendRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    params: NbClientParams,
    options: NbRequestParams,
): Promise<Response> {
    const headers = {
        ...options.headers,
    };

    if (options.query) {
        options.path += '?' + makeUrlParams(options.query);
    }

    const url = `${params.host}/api/v${params.version || 1}${options.path}`;

    const request: RequestInit = {
        method,
        headers,
        body: options.body,
    };

    return fetch(url, request);
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
