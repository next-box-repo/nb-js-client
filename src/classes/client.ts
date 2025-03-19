import {
    AuthApiService,
    ConnectionsApiService,
    DiscoveryApiService,
    DivideApiService,
    ExtensionsApiService,
    ExtensionsExternalApiService,
    FcaApiService,
    GatewayApiService,
    GroupApiService,
    LicenseApiService,
    LinksApiService,
    LogstashApiService,
    NotificationApiService,
    RoleApiService,
    ShareApiService,
    StorageElementApiService,
    StorageFilesApiService,
    StorageInstanceApiService,
    StorageShareApiService,
    StorageTrashApiService,
    UserApiService,
    VersionApiService,
} from '../api';

import { NbAppState, NbClientParams } from '../types/base';
import { Interceptor } from '../types/interceptor';
import { Rest } from './rest';
import { TokenUpdate } from './token-update';

export class Client {
    state!: NbAppState;

    AuthApiService = new AuthApiService(this);
    ConnectionsApiService = new ConnectionsApiService(this);
    DiscoveryApiService = new DiscoveryApiService(this);
    DivideApiService = new DivideApiService(this);
    ExtensionsApiService = new ExtensionsApiService(this);
    ExtensionsExternalApiService = new ExtensionsExternalApiService(this);
    FcaApiService = new FcaApiService(this);
    GatewayApiService = new GatewayApiService(this);
    GroupApiService = new GroupApiService(this);
    LicenseApiService = new LicenseApiService(this);
    LinksApiService = new LinksApiService(this);
    LogstashApiService = new LogstashApiService(this);
    NotificationApiService = new NotificationApiService(this);
    RoleApiService = new RoleApiService(this);
    ShareApiService = new ShareApiService(this);
    StorageElementApiService = new StorageElementApiService(
        this,
        this.FcaApiService,
    );
    StorageFilesApiService = new StorageFilesApiService(this);
    StorageInstanceApiService = new StorageInstanceApiService(this);
    StorageShareApiService = new StorageShareApiService(this);
    StorageTrashApiService = new StorageTrashApiService(this);
    UserApiService = new UserApiService(this);
    VersionApiService = new VersionApiService(this);

    tokenUpdate = new TokenUpdate();
    rest = new Rest(this, this.tokenUpdate);

    requestInterceptors: Interceptor<RequestInit>[] = [];
    responseInterceptors: Interceptor<any>[] = [];

    constructor(clientParams: NbClientParams) {
        this.state = {
            clientParams: {
                host: clientParams?.host,
                version: clientParams?.version,
            },
            requestParams: {
                path: '',
                headers: {},
                query: {},
                body: null,
                cache: 'no-cache',
            },
            authToken: null,
            skipInterceptors: false,
        };

        this.rest.baseHost = this.state.clientParams.host || '';
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
            fulfilled: (response: any) => any | Promise<any>,
            rejected: (error: any) => any,
        ) => {
            this.responseInterceptors.push({ fulfilled, rejected });
        },
    };
}
