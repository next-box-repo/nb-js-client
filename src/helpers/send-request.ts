import { NbAppState } from '../types/base';
import { Interceptor } from '../types/interceptor';

export async function sendRequest(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options: {
        query?: Record<string, any>;
        body?: BodyInit | null;
        cache?: RequestCache;
    },
    state: NbAppState,
    interceptors: {
        request: Interceptor<RequestInit>[];
        response: Interceptor<Response>[];
    },
): Promise<Response> {
    const skipInterceptors = state.skipInterceptors ?? false;
    state.skipInterceptors = false;

    if (options.query) {
        path += '?' + makeUrlParams(options.query);
    }

    let request: RequestInit = {
        method,
        headers: state.requestParams.headers,
        cache: options.cache || state.requestParams.cache,
        body: options.body || state.requestParams.body,
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

    const url = `${state.clientParams.host}/api/v${state.clientParams.version || 1}${path}`;
    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

    let response: Response;

    try {
        response = await fetch(sanitizedUrl, request);
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
