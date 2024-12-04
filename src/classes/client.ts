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

    Auth = new AuthApiService(this);
    Connections = new ConnectionsApiService(this);
    Discovery = new DiscoveryApiService(this);
    Divide = new DivideApiService(this);
    Extensions = new ExtensionsApiService(this);
    ExtensionsExternal = new ExtensionsExternalApiService(this);
    Fca = new FcaApiService(this);
    Gateway = new GatewayApiService(this);
    Group = new GroupApiService(this);
    License = new LicenseApiService(this);
    Logstash = new LogstashApiService(this);
    Notifications = new NotificationsApiService(this);
    Role = new RoleApiService(this);
    Share = new ShareApiService(this);
    StorageElement = new StorageElementApiService(this);
    StorageFiles = new StorageFilesApiService(this);
    StorageShare = new StorageShareApiService(this);
    StorageTrash = new StorageTrashApiService(this);
    User = new UserApiService(this);

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
