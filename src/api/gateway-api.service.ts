import { Client } from '../classes';
import {
    Extension,
    ExtensionDefault,
    License,
    LockScreen,
    ResponseList,
    Restriction,
    Setting,
    SettingValue,
    User,
    UserNotification,
} from '../types';

export class GatewayApiService {
    constructor(private client: Client) {}

    settings(): Promise<Setting[]> {
        return this.client.rest.get('/settings');
    }

    changeSettings(data: SettingValue[]): Promise<void> {
        return this.client.rest.post('/settings', JSON.stringify(data));
    }

    queryInit(): Promise<QueryInitResponse> {
        return this.client.rest.get('/query/init');
    }
}

export interface QueryInitResponse {
    license?: License;
    unread_notifications?: ResponseList<UserNotification> & {
        total_all: number;
    };

    extensions_apps?: ResponseList<Extension>;
    extensions_defaults: ResponseList<ExtensionDefault>;

    me?: User;
    cache_users: User[];

    lock_screen: LockScreen;
    restrictions?: Restriction;

    open_in_desktop_settings: { open_in_desktop_enabled: boolean };

    // нужен для devtools
    inject_scripts?: string[];
}
