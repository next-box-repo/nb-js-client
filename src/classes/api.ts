import { Client } from './client';
import { sendRequest } from '../helpers';
import { NbAppState } from '../types';
import {
    AuthApiService,
    ConnectionsApiService,
    DiscoveryApiService,
    DivideApiService,
    ExtensionsApiService,
    ExtensionsExternalApiService,
    FcaApiService,
    GroupApiService,
    RoleApiService,
    StorageElementApiService,
    StorageShareApiService,
    StorageTrashApiService,
    UserApiService,
} from '../api';
import { StorageFilesApiService } from '../api/storage-files-api.service';

export type ApiServices = {
    Auth: AuthApiService;
    Connections: ConnectionsApiService;
    Discovery: DiscoveryApiService;
    Divide: DivideApiService;
    Extensions: ExtensionsApiService;
    ExtensionsExternal: ExtensionsExternalApiService;
    Fca: FcaApiService;
    Group: GroupApiService;
    Role: RoleApiService;
    StorageElement: StorageElementApiService;
    StorageFiles: StorageFilesApiService;
    StorageShare: StorageShareApiService;
    StorageTrash: StorageTrashApiService;
    User: UserApiService;
};

export class Api {
    constructor(private client: Client) {}

    get state(): NbAppState {
        return this.client.state;
    }

    get(path: string, query?: Record<string, any>): Promise<any> {
        return sendRequest(
            'GET',
            this.state.client,
            {
                path,
                query: { ...this.state.api.query, ...query },
                headers: this.state.api.headers,
                cache: 'no-cache',
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
        );
    }

    post(path: string, body?: BodyInit | null): Promise<any> {
        return sendRequest(
            'POST',
            this.state.client,
            {
                path,
                body,
                headers: this.state.api.headers,
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
        );
    }

    put(path: string, body?: BodyInit | null): Promise<any> {
        return sendRequest(
            'PUT',
            this.state.client,
            {
                path,
                body,
                headers: this.state.api.headers,
                cache: 'no-cache',
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
        );
    }

    patch(path: string, body?: BodyInit | null): Promise<any> {
        return sendRequest(
            'PATCH',
            this.state.client,
            {
                path,
                body,
                headers: this.state.api.headers,
                cache: 'no-cache',
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
        );
    }

    delete(path: string, query?: Record<string, any>): Promise<any> {
        return sendRequest(
            'DELETE',
            this.state.client,
            {
                path,
                query: { ...this.state.api.query, ...query },
                headers: this.state.api.headers,
            },
            {
                request: this.client.requestInterceptors,
                response: this.client.responseInterceptors,
            },
        );
    }
}
