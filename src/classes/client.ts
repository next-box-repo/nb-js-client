import { NbAppState, NbClientParams } from '../types/base';
import { defaultState } from '../helpers/default-state';
import { Interceptor } from '../types/interceptor';
import { Api } from './api';
import {
    AuthApiService,
    ConnectionsApiService,
    GroupApiService,
    RoleApiService,
    UserApiService,
} from '../api';

export class Client {
    state: NbAppState = defaultState();

    Api!: Api;

    Auth!: AuthApiService;
    User!: UserApiService;
    Group!: GroupApiService;
    Connections!: ConnectionsApiService;
    Role!: RoleApiService;

    requestInterceptors: Interceptor<RequestInit>[] = [];
    responseInterceptors: Interceptor<Response>[] = [];

    constructor(params: NbClientParams) {
        this.state.client = params;

        this.Api = new Api(this);

        this.Auth = new AuthApiService(this.Api);
        this.Group = new GroupApiService(this.Api);
        this.User = new UserApiService(this.Api);
        this.Role = new RoleApiService(this.Api);
        this.Connections = new ConnectionsApiService(this.Api);
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

    resetParams(state: NbAppState): void {
        this.state = {
            ...this.state,
            ...state,
        };
    }
}
