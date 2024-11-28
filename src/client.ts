import { NbAppState, NbClientParams } from './types/base';
import { Api } from './api';
import { UserService } from './services';
import { Interceptor } from './interceptors/reques.interceptor';
import { defaultState } from './helpers/default-state';

export class Client {
    state: NbAppState = defaultState();

    Api!: Api;
    User!: UserService;

    requestInterceptors: Interceptor<RequestInit>[] = [];
    responseInterceptors: Interceptor<Response>[] = [];

    constructor(params: NbClientParams) {
        this.state.client = params;

        this.Api = new Api(this);
        this.User = new UserService(this.Api);
    }

    request = {
        use: (
            fulfilled: (
                config: RequestInit,
            ) => RequestInit | Promise<RequestInit>,
            rejected?: (error: any) => any,
        ) => {
            this.requestInterceptors.push({ fulfilled, rejected });
        },
    };

    response = {
        use: (
            fulfilled: (response: Response) => Response | Promise<Response>,
            rejected?: (error: any) => any,
        ) => {
            this.responseInterceptors.push({ fulfilled, rejected });
        },
    };

    resetParams(state: NbAppState): void {
        this.state = state;
    }
}
