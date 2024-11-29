import { RequestBaseParams } from './base';
import { PermissionType } from './divide';
import { User } from './user';

export interface Connection {
    id: number;
    name: string;
    type: ConnectionType;
    address: string;
    login: string;
    password: string;
    port: number;
    root_path: string;
    group_name: ConnectionGroup;

    divide_id?: number;
    access_mode?: PermissionType;

    owner?: Pick<User, 'first_name' | 'last_name' | 'login' | 'middle_name'>;

    update_date: string;
    create_date: string;
    expire_in: string;
    to_user_group_name?: string;
}

export enum ConnectionGroup {
    Storages = 'storages_connections_group',
    Webhooks = 'webhooks_connections_group',
    Unknown = 'unknown_connections_group',
    Proxy = 'proxy_connections_group',
}

export enum ConnectionType {
    SSH = 'ssh_connection',
    YandexDisk = 'yandex_disk',
    Mail = 'mail',
    Discord = 'discord',
    Webdav = 'webdav_connection',
    Nextcloud = 'nextcloud_connection',
    NextBox = 'nextbox_connection',
    HttpProxy = 'http_proxy_connection',
    S3 = 's3_connection',
}

export interface RequestConnectionParams extends RequestBaseParams {
    name?: string | null;
    group_name?: ConnectionGroup;
    is_divided?: boolean;
    type?: string;
}

export type ConnectionCreateParams = Omit<Connection, 'group_name'>;
