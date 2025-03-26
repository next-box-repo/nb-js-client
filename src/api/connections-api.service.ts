import { Client } from '../classes';
import {
    Connection,
    ConnectionGroup,
    ConnectionType,
    RequestBaseParams,
    ResponseItem,
    ResponseList,
} from '../types';

const CONNECTIONS = '/connections';
const CONNECTIONS_DASHBOARD = `${CONNECTIONS}/dashboard`;

export class ConnectionsApiService {
    constructor(private client: Client) {}

    list(params: RequestConnectionParams): Promise<ResponseList<Connection>> {
        return this.client.rest.get(CONNECTIONS, params);
    }

    get(id: number): Promise<ResponseItem<Connection>> {
        return this.client.rest.get(`${CONNECTIONS}/${id}`);
    }

    update(
        id: number,
        data: ConnectionCreateParams,
    ): Promise<ResponseItem<Connection>> {
        return this.client.rest.put(`${CONNECTIONS}/${id}`, data);
    }

    delete(id: number): Promise<void> {
        return this.client.rest.delete(`${CONNECTIONS}/${id}`);
    }

    create(data: ConnectionCreateParams): Promise<ResponseItem<Connection>> {
        const routes: { [key: string]: string } = {
            [ConnectionType.SSH]: '/disk/ssh',
            [ConnectionType.Webdav]: '/disk/webdav',
            [ConnectionType.Nextcloud]: '/disk/nextcloud',
            [ConnectionType.NextBox]: '/disk/nextbox',
            [ConnectionType.Discord]: '/webhooks/discord',
            [ConnectionType.Mail]: '/webhooks/mail',
            [ConnectionType.HttpProxy]: '/http_proxy',
            [ConnectionType.S3]: '/disk/s3',
        };

        return this.client.rest.post(routes[data.type] || CONNECTIONS, data);
    }

    dashboard(
        params: RequestConnectionParams,
    ): Promise<ResponseList<Connection>> {
        return this.client.rest.get(CONNECTIONS_DASHBOARD, params);
    }
}

export interface RequestConnectionParams extends RequestBaseParams {
    id?: number[];
    name?: string | null;
    group_name?: ConnectionGroup;
    is_divided?: boolean;
    type?: string;
}

export type ConnectionCreateParams = Omit<Connection, 'group_name'>;
