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
import { NbAppState, NbClientParams, NbRequestParams } from '../types/base';
import { Interceptor } from '../types/interceptor';
import { Rest } from './rest';

export class Client {
    state!: NbAppState;

    rest = new Rest(this);

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

    requestInterceptors: Interceptor<RequestInit>[] = [];
    responseInterceptors: Interceptor<Response>[] = [];

    constructor(clientParams: NbClientParams) {
        this.state = {
            clientParams,
            requestParams: {
                path: '',
                headers: {},
                query: {},
                body: null,
                cache: 'no-cache',
            },
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

    resetParams(params: Partial<NbClientParams & NbRequestParams>): void {
        const { host, version } = params as NbClientParams;
        const { path, headers, query, body, cache } = params as NbRequestParams;

        const { clientParams, requestParams } = this.state;

        this.state = {
            clientParams: {
                host: host || clientParams.host,
                version: version ?? clientParams.version,
            },
            requestParams: {
                path: path || requestParams.path,
                headers: headers || requestParams.headers,
                query: query || requestParams.query,
                body: body ?? requestParams.body,
                cache: cache || requestParams.cache,
            },
        };
    }
}
