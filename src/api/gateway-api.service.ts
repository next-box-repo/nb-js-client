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
import { FileLocking } from '../types/file-locking';
import { LdapStrict } from '../types/ldap-strict';

const SETTINGS = '/settings';

export class GatewayApiService {
    constructor(private client: Client) {}

    settings(): Promise<Setting[]> {
        return this.client.rest.get(SETTINGS);
    }

    changeSettings(data: SettingValue[]): Promise<void> {
        return this.client.rest.post(SETTINGS, data);
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
    view_type: QueryInitViewType;
    file_locking: FileLocking;

    restrictions?: Restriction;

    open_in_desktop_settings: { open_in_desktop_enabled: boolean };

    two_factor_auth_enabled: boolean;
    ldap_groups_roles_strict: LdapStrict;
    // нужен для devtools
    inject_scripts?: string[];
}

export enum QueryInitViewType {
    Standard = 'Standard',
    Simple = 'Simple',
}
