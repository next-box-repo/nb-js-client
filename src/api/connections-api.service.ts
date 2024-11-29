import { Api } from '../classes';
import {
    Connection,
    ConnectionCreateParams,
    ConnectionType,
    RequestConnectionParams,
    ResponseItem,
    ResponseList,
} from '../types';

const CONNECTIONS = '/connections';
const CONNECTIONS_DASHBOARD = `${CONNECTIONS}/dashboard`;

export class ConnectionsApiService {
    constructor(private api: Api) {}

    list(params: RequestConnectionParams): Promise<ResponseList<Connection>> {
        return this.api.get(CONNECTIONS, params);
    }

    get(id: number): Promise<ResponseItem<Connection>> {
        return this.api.get(`${CONNECTIONS}/${id}`);
    }

    update(
        id: number,
        data: ConnectionCreateParams,
    ): Promise<ResponseItem<Connection>> {
        return this.api.put(`${CONNECTIONS}/${id}`, JSON.stringify(data));
    }

    delete(id: number): Promise<void> {
        return this.api.delete(`${CONNECTIONS}/${id}`);
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

        return this.api.post(
            routes[data.type] || CONNECTIONS,
            JSON.stringify(data),
        );
    }

    dashboard(
        params: RequestConnectionParams,
    ): Promise<ResponseList<Connection>> {
        return this.api.get(CONNECTIONS_DASHBOARD, params);
    }
}
