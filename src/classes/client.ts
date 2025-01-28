import {
    AuthApi,
    ConnectionsApi,
    DiscoveryApi,
    DivideApi,
    ExtensionsApi,
    ExtensionsExternalApi,
    FcaApi,
    GatewayApi,
    GroupApi,
    LicenseApi,
    LogstashApi,
    RoleApi,
    ShareApi,
    StorageElementApi,
    StorageShareApi,
    StorageTrashApi,
    UserApi,
} from '../api';
import { NotificationApi } from '../api/notification-api.service';
import { StorageFilesApi } from '../api/storage-files-api.service';
import { AuthToken } from '../types';
import { NbAppState, NbClientParams } from '../types/base';
import { Interceptor } from '../types/interceptor';
import { Rest } from './rest';
import { TokenUpdate } from './token-update';

export class Client {
    state!: NbAppState;

    AuthApi = new AuthApi(this);
    ConnectionsApi = new ConnectionsApi(this);
    DiscoveryApi = new DiscoveryApi(this);
    DivideApi = new DivideApi(this);
    ExtensionsApi = new ExtensionsApi(this);
    ExtensionsExternalApi = new ExtensionsExternalApi(this);
    FcaApi = new FcaApi(this);
    GatewayApi = new GatewayApi(this);
    GroupApi = new GroupApi(this);
    LicenseApi = new LicenseApi(this);
    LogstashApi = new LogstashApi(this);
    NotificationApi = new NotificationApi(this);
    RoleApi = new RoleApi(this);
    ShareApi = new ShareApi(this);
    StorageElementApi = new StorageElementApi(this);
    StorageFilesApi = new StorageFilesApi(this);
    StorageShareApi = new StorageShareApi(this);
    StorageTrashApi = new StorageTrashApi(this);
    UserApi = new UserApi(this);

    tokenUpdate = new TokenUpdate(this.AuthApi);
    rest = new Rest(this, this.tokenUpdate);

    requestInterceptors: Interceptor<RequestInit>[] = [];
    responseInterceptors: Interceptor<Response>[] = [];

    constructor(clientParams: NbClientParams) {
        this.state = {
            clientParams: {
                host:
                    clientParams?.host ||
                    `${window.location.protocol}//${window.location.host}`,
                version: clientParams?.version || '/api/v1',
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

    resetParams(params: {
        host?: string;
        version?: string;
        headers?: Record<string, any>;
        cache?: RequestCache;
        authTokens?: Map<number, AuthToken> | null;
        skipInterceptors?: boolean;
    }): Promise<void> {
        return new Promise<void>((resolve) => {
            const {
                host,
                version,
                headers,
                cache,
                authTokens,
                skipInterceptors,
            } = params;

            this.state = {
                clientParams: {
                    host: host || this.state.clientParams.host,
                    version: version ?? this.state.clientParams.version,
                },
                requestParams: {
                    ...this.state.requestParams,
                    headers: headers || this.state.requestParams.headers,
                    cache: cache || this.state.requestParams.cache,
                },
                authToken: authTokens || this.state.authToken,
                skipInterceptors:
                    skipInterceptors || this.state.skipInterceptors,
            };

            resolve();
        });
    }
}
