import { NbAppState, NbClientParams } from '../types/base';
import { defaultState } from '../helpers/default-state';
import { Interceptor } from '../types/interceptor';
import { Api, ApiServices } from './api';

export class Client {
    state: NbAppState = defaultState();

    requestInterceptors: Interceptor<RequestInit>[] = [];
    responseInterceptors: Interceptor<Response>[] = [];

    private Api!: Api;
    private services = new Map<string, any>();

    constructor(params: NbClientParams) {
        this.state.client = params;

        this.Api = new Api(this);
    }

    get api(): ApiServices {
        const api: Partial<ApiServices> = {};

        this.services.forEach((value, key) => {
            api[key as keyof ApiServices] = value;
        });

        return api as ApiServices;
    }

    request = {
        use: (
            fulfilled: (
                config: RequestInit,
            ) => RequestInit | Promise<RequestInit>,
            rejected: (error: any) => any,
        ) => {
            this.requestInterceptors.push({ fulfilled, rejected });
        },
    };

    response = {
        use: (
            fulfilled: (response: Response) => Response | Promise<Response>,
            rejected: (error: any) => any,
        ) => {
            this.responseInterceptors.push({ fulfilled, rejected });
        },
    };

    handler = {
        registerService: <T extends keyof ApiServices>(
            ServiceClass: new (api: Api) => ApiServices[T],
            serviceName: T,
        ) => {
            this.services.set(serviceName, new ServiceClass(this.Api));
        },
    };

    resetParams(state: NbAppState): void {
        this.state = state;
    }
}
