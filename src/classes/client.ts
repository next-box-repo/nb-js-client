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
    LogstashApiService,
    RoleApiService,
    ShareApiService,
    StorageElementApiService,
    StorageShareApiService,
    StorageTrashApiService,
    UserApiService,
} from '../api';
import { NotificationsApiService } from '../api/notifications-api.service';
import { StorageFilesApiService } from '../api/storage-files-api.service';
import { AuthToken } from '../types';
import { NbAppState, NbClientParams } from '../types/base';
import { Interceptor } from '../types/interceptor';
import { Rest } from './rest';
import { TokenUpdate } from './token-update';

export class Client {
    state!: NbAppState;

    AuthApi = new AuthApiService(this);
    ConnectionsApi = new ConnectionsApiService(this);
    DiscoveryApi = new DiscoveryApiService(this);
    DivideApi = new DivideApiService(this);
    ExtensionsApi = new ExtensionsApiService(this);
    ExtensionsExternalApi = new ExtensionsExternalApiService(this);
    FcaApi = new FcaApiService(this);
    GatewayApi = new GatewayApiService(this);
    GroupApi = new GroupApiService(this);
    LicenseApi = new LicenseApiService(this);
    LogstashApi = new LogstashApiService(this);
    NotificationsApi = new NotificationsApiService(this);
    RoleApi = new RoleApiService(this);
    ShareApi = new ShareApiService(this);
    StorageElementApi = new StorageElementApiService(this);
    StorageFilesApi = new StorageFilesApiService(this);
    StorageShareApi = new StorageShareApiService(this);
    StorageTrashApi = new StorageTrashApiService(this);
    UserApi = new UserApiService(this);

    tokenUpdate = new TokenUpdate(this.AuthApi);
    rest = new Rest(this, this.tokenUpdate);

    requestInterceptors: Interceptor<RequestInit>[] = [];
    responseInterceptors: Interceptor<Response>[] = [];

    constructor(clientParams: NbClientParams) {
        this.state = {
            clientParams: {
                host: clientParams?.host || '',
                version: clientParams?.version || 1,
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
        version?: number;
        headers?: Record<string, any>;
        cache?: RequestCache;
        authTokens?: AuthToken[] | null;
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
