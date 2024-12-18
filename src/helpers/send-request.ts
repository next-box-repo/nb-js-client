import { NbClientParams, NbRequestParams } from '../types/base';
import { Interceptor } from '../types/interceptor';

export async function sendRequest(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    params: NbClientParams,
    options: NbRequestParams,
    interceptors: {
        request: Interceptor<RequestInit>[];
        response: Interceptor<Response>[];
    },
    skipInterceptors: boolean,
): Promise<Response> {
    const headers = {
        ...options.headers,
    };

    if (options.query) {
        options.path += '?' + makeUrlParams(options.query);
    }

    const url = `${params.host}/api/v${params.version || 1}${options.path}`;

    let request: RequestInit = {
        method,
        headers,
        body: options.body,
        cache: options.cache,
    };

    if (!skipInterceptors) {
        for (const interceptor of interceptors.request) {
            try {
                request = await interceptor.fulfilled(request);
            } catch (error) {
                if (interceptor.rejected) interceptor.rejected(error);
                else throw error;
            }
        }
    }

    let response: Response;

    try {
        response = await fetch(url, request);
    } catch (error) {
        for (const interceptor of interceptors.response) {
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

    for (const interceptor of interceptors.response) {
        try {
            response = await interceptor.fulfilled(response);
        } catch (error) {
            if (interceptor.rejected) interceptor.rejected(error);
            else throw error;
        }
    }

    return response;
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
