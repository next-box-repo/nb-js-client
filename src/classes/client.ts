import { NbAppState, NbClientParams } from '../types/base';
import { defaultState } from '../helpers/default-state';
import { Interceptor } from '../types/interceptor';
import { Api } from './api';
import {
    AuthApiService,
    ConnectionsApiService,
    DiscoveryApiService,
    ExtensionsExternalApiService,
    FcaApiService,
    GroupApiService,
    RoleApiService,
    UserApiService,
} from '../api';
import { DivideApiService } from '../api/divide-api.service';
import { ExtensionsApiService } from '../api/extensions-api.service';

export class Client {
    state: NbAppState = defaultState();

    Api!: Api;

    Auth!: AuthApiService;
    Connections!: ConnectionsApiService;
    Divide!: DivideApiService;
    Discovery!: DiscoveryApiService;
    Extensions!: ExtensionsApiService;
    ExtensionsExternal!: ExtensionsExternalApiService;
    Fca!: FcaApiService;
    Group!: GroupApiService;
    Role!: RoleApiService;
    User!: UserApiService;

    requestInterceptors: Interceptor<RequestInit>[] = [];
    responseInterceptors: Interceptor<Response>[] = [];

    constructor(params: NbClientParams) {
        this.state.client = params;

        this.Api = new Api(this);

        this.Auth = new AuthApiService(this.Api);
        this.Connections = new ConnectionsApiService(this.Api);
        this.Divide = new DivideApiService(this.Api);
        this.Discovery = new DiscoveryApiService(this.Api);
        this.Extensions = new ExtensionsApiService(this.Api);
        this.ExtensionsExternal = new ExtensionsExternalApiService(this.Api);
        this.Fca = new FcaApiService(this.Api);
        this.Group = new GroupApiService(this.Api);
        this.Role = new RoleApiService(this.Api);
        this.User = new UserApiService(this.Api);
    }

    private services: Record<string, any> = {};

    get api(): Record<string, any> {
        return this.services;
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
        this.state = state;
    }
}
